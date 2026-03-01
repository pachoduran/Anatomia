#!/usr/bin/env python3
"""
VetBones API Testing Script
Testing the veterinary anatomy quiz API endpoints according to review requirements.
"""

import requests
import json
import sys
from typing import Dict, List, Any

# Base URL from the review request
BASE_URL = "https://skeletal-quiz.preview.emergentagent.com"

class VetBonesAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'VetBones-API-Tester/1.0'
        })
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, details: str, response_data: Any = None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'details': details,
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if not success:
            print(f"   Details: {details}")
        return success

    def make_request(self, endpoint: str, expected_status: int = 200) -> tuple[bool, Any]:
        """Make API request and return success status and response data"""
        try:
            url = f"{self.base_url}{endpoint}"
            print(f"Testing: {url}")
            response = self.session.get(url, timeout=30)
            
            if response.status_code != expected_status:
                return False, f"Expected {expected_status}, got {response.status_code}: {response.text[:200]}"
            
            if expected_status == 200:
                try:
                    return True, response.json()
                except json.JSONDecodeError:
                    return False, "Response is not valid JSON"
            else:
                return True, response.text
                
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}"

    def test_1_welcome_endpoint(self):
        """Test 1: GET /api/ - should return welcome message"""
        success, data = self.make_request("/api/")
        if not success:
            return self.log_result("GET /api/ - Welcome message", False, data)
        
        if not isinstance(data, dict) or 'message' not in data:
            return self.log_result("GET /api/ - Welcome message", False, 
                                 f"Expected dict with 'message' field, got: {data}")
        
        return self.log_result("GET /api/ - Welcome message", True, 
                             f"Message: {data['message']}", data)

    def test_2_animals_endpoint(self):
        """Test 2: GET /api/animals - should return array with horse animal"""
        success, data = self.make_request("/api/animals")
        if not success:
            return self.log_result("GET /api/animals - Animal list", False, data)
        
        if not isinstance(data, list) or len(data) == 0:
            return self.log_result("GET /api/animals - Animal list", False, 
                                 f"Expected non-empty array, got: {data}")
        
        # Look for horse
        horse = None
        for animal in data:
            if animal.get('id') == 'horse':
                horse = animal
                break
        
        if not horse:
            return self.log_result("GET /api/animals - Animal list", False, 
                                 "Horse not found in animals list")
        
        # Check required fields
        required_fields = ['id', 'name', 'name_scientific', 'total_bones', 'available']
        missing_fields = [f for f in required_fields if f not in horse]
        
        if missing_fields:
            return self.log_result("GET /api/animals - Animal list", False, 
                                 f"Horse missing fields: {missing_fields}")
        
        return self.log_result("GET /api/animals - Animal list", True, 
                             f"Found horse with all required fields. Total bones: {horse['total_bones']}", data)

    def test_3_divisions_horse(self):
        """Test 3: GET /api/divisions/horse - should return 2 divisions"""
        success, data = self.make_request("/api/divisions/horse")
        if not success:
            return self.log_result("GET /api/divisions/horse - Divisions", False, data)
        
        if not isinstance(data, list) or len(data) != 2:
            return self.log_result("GET /api/divisions/horse - Divisions", False, 
                                 f"Expected array of 2 divisions, got: {data}")
        
        # Check for axial and apendicular
        division_ids = [d.get('id') for d in data]
        expected_divisions = {'axial', 'apendicular'}
        
        if set(division_ids) != expected_divisions:
            return self.log_result("GET /api/divisions/horse - Divisions", False, 
                                 f"Expected {expected_divisions}, got: {set(division_ids)}")
        
        # Check required fields for each division
        required_fields = ['id', 'name', 'desc', 'description', 'bones', 'total_bones', 'icon']
        for division in data:
            missing_fields = [f for f in required_fields if f not in division]
            if missing_fields:
                return self.log_result("GET /api/divisions/horse - Divisions", False, 
                                     f"Division {division.get('id')} missing fields: {missing_fields}")
        
        return self.log_result("GET /api/divisions/horse - Divisions", True, 
                             "Found axial and apendicular divisions with all required fields", data)

    def test_4_regions_axial(self):
        """Test 4: GET /api/regions/horse/axial - should return 3 regions"""
        success, data = self.make_request("/api/regions/horse/axial")
        if not success:
            return self.log_result("GET /api/regions/horse/axial - Axial regions", False, data)
        
        if not isinstance(data, list) or len(data) != 3:
            return self.log_result("GET /api/regions/horse/axial - Axial regions", False, 
                                 f"Expected array of 3 regions, got: {len(data) if isinstance(data, list) else 'not array'}")
        
        # Check for expected regions
        region_ids = [r.get('id') for r in data]
        expected_regions = {'craneo', 'columna', 'torax'}
        
        if set(region_ids) != expected_regions:
            return self.log_result("GET /api/regions/horse/axial - Axial regions", False, 
                                 f"Expected {expected_regions}, got: {set(region_ids)}")
        
        # Check required fields and different image URLs
        required_fields = ['name', 'desc', 'bones', 'image']
        image_urls = []
        
        for region in data:
            missing_fields = [f for f in required_fields if f not in region]
            if missing_fields:
                return self.log_result("GET /api/regions/horse/axial - Axial regions", False, 
                                     f"Region {region.get('id')} missing fields: {missing_fields}")
            image_urls.append(region['image'])
        
        # Verify different image URLs
        if len(set(image_urls)) != 3:
            return self.log_result("GET /api/regions/horse/axial - Axial regions", False, 
                                 f"Expected 3 different image URLs, got: {image_urls}")
        
        return self.log_result("GET /api/regions/horse/axial - Axial regions", True, 
                             f"Found 3 regions with different images: {image_urls}", data)

    def test_5_regions_apendicular(self):
        """Test 5: GET /api/regions/horse/apendicular - should return 2 regions"""
        success, data = self.make_request("/api/regions/horse/apendicular")
        if not success:
            return self.log_result("GET /api/regions/horse/apendicular - Apendicular regions", False, data)
        
        if not isinstance(data, list) or len(data) != 2:
            return self.log_result("GET /api/regions/horse/apendicular - Apendicular regions", False, 
                                 f"Expected array of 2 regions, got: {len(data) if isinstance(data, list) else 'not array'}")
        
        # Check for expected regions
        region_ids = [r.get('id') for r in data]
        expected_regions = {'anterior', 'posterior'}
        
        if set(region_ids) != expected_regions:
            return self.log_result("GET /api/regions/horse/apendicular - Apendicular regions", False, 
                                 f"Expected {expected_regions}, got: {set(region_ids)}")
        
        # Check different image URLs
        image_urls = [r.get('image') for r in data]
        if len(set(image_urls)) != 2:
            return self.log_result("GET /api/regions/horse/apendicular - Apendicular regions", False, 
                                 f"Expected 2 different image URLs, got: {image_urls}")
        
        return self.log_result("GET /api/regions/horse/apendicular - Apendicular regions", True, 
                             f"Found 2 regions with different images: {image_urls}", data)

    def test_exam_endpoint(self, animal: str, division: str, region: str, num: int, expected_image_type: str):
        """Test exam endpoint and verify image URL"""
        endpoint = f"/api/exam/{animal}/{division}/{region}?num={num}"
        success, data = self.make_request(endpoint)
        
        test_name = f"GET {endpoint} - {expected_image_type} exam"
        
        if not success:
            return self.log_result(test_name, False, data)
        
        if not isinstance(data, dict):
            return self.log_result(test_name, False, f"Expected dict, got: {type(data)}")
        
        # Check required fields
        required_fields = ['region', 'image', 'questions']
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            return self.log_result(test_name, False, f"Missing fields: {missing_fields}")
        
        # Check questions structure
        questions = data.get('questions', [])
        if len(questions) != num:
            return self.log_result(test_name, False, f"Expected {num} questions, got {len(questions)}")
        
        for i, q in enumerate(questions):
            required_q_fields = ['id', 'name', 'desc', 'x', 'y', 'color', 'options', 'answer']
            missing_q_fields = [f for f in required_q_fields if f not in q]
            if missing_q_fields:
                return self.log_result(test_name, False, f"Question {i} missing fields: {missing_q_fields}")
        
        # Verify image URL contains expected type
        image_url = data.get('image', '')
        expected_images = {
            'skull': 'horse_skull.jpg',
            'spine': 'horse_spine.jpg', 
            'thorax': 'horse_thorax.jpg',
            'forelimb': 'horse_forelimb.jpg',
            'hindlimb': 'horse_hindlimb.jpg'
        }
        
        expected_file = expected_images.get(expected_image_type)
        if expected_file and expected_file not in image_url:
            return self.log_result(test_name, False, f"Expected image {expected_file}, got: {image_url}")
        
        return self.log_result(test_name, True, f"Image URL: {image_url}, Questions: {len(questions)}", data)

    def test_6_exam_craneo(self):
        """Test 6: Craneo exam"""
        return self.test_exam_endpoint("horse", "axial", "craneo", 3, "skull")

    def test_7_exam_columna(self):
        """Test 7: Columna exam"""
        return self.test_exam_endpoint("horse", "axial", "columna", 3, "spine")

    def test_8_exam_torax(self):
        """Test 8: Torax exam"""
        return self.test_exam_endpoint("horse", "axial", "torax", 2, "thorax")

    def test_9_exam_anterior(self):
        """Test 9: Anterior exam"""
        return self.test_exam_endpoint("horse", "apendicular", "anterior", 3, "forelimb")

    def test_10_exam_posterior(self):
        """Test 10: Posterior exam"""
        return self.test_exam_endpoint("horse", "apendicular", "posterior", 3, "hindlimb")

    def test_11_image_assets(self):
        """Test 11: Verify all 5 image assets load correctly"""
        image_files = [
            "horse_skull.jpg",
            "horse_spine.jpg", 
            "horse_thorax.jpg",
            "horse_forelimb.jpg",
            "horse_hindlimb.jpg"
        ]
        
        all_success = True
        loaded_images = []
        
        for image_file in image_files:
            success, data = self.make_request(f"/api/assets/{image_file}")
            if success:
                loaded_images.append(image_file)
            else:
                all_success = False
                self.log_result(f"GET /api/assets/{image_file}", False, data)
        
        if all_success:
            return self.log_result("Image assets verification", True, 
                                 f"All {len(image_files)} images loaded successfully: {loaded_images}")
        else:
            return self.log_result("Image assets verification", False, 
                                 f"Only {len(loaded_images)}/{len(image_files)} images loaded")

    def test_12_404_cases(self):
        """Test 12: Test 404 cases"""
        test_cases = [
            ("/api/divisions/cat", "Invalid animal division"),
            ("/api/exam/horse/axial/nonexistent", "Nonexistent region exam")
        ]
        
        all_success = True
        for endpoint, description in test_cases:
            success, data = self.make_request(endpoint, expected_status=404)
            if not success:
                all_success = False
                self.log_result(f"404 Test: {description}", False, data)
            else:
                self.log_result(f"404 Test: {description}", True, "Correctly returned 404")
        
        return all_success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🧪 Starting VetBones API Testing")
        print(f"🌐 Base URL: {self.base_url}")
        print("=" * 60)
        
        test_methods = [
            self.test_1_welcome_endpoint,
            self.test_2_animals_endpoint,
            self.test_3_divisions_horse,
            self.test_4_regions_axial,
            self.test_5_regions_apendicular,
            self.test_6_exam_craneo,
            self.test_7_exam_columna,
            self.test_8_exam_torax,
            self.test_9_exam_anterior,
            self.test_10_exam_posterior,
            self.test_11_image_assets,
            self.test_12_404_cases
        ]
        
        passed = 0
        total = len(test_methods)
        
        for test_method in test_methods:
            try:
                if test_method():
                    passed += 1
            except Exception as e:
                self.log_result(test_method.__name__, False, f"Test execution error: {str(e)}")
            print()
        
        print("=" * 60)
        print(f"🎯 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ ALL TESTS PASSED!")
        else:
            print("❌ Some tests failed - see details above")
            failed_tests = [r for r in self.test_results if not r['success']]
            print("\n🔍 Failed Tests Summary:")
            for test in failed_tests:
                print(f"   - {test['test']}: {test['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = VetBonesAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)