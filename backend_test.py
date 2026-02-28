#!/usr/bin/env python3
"""
VetBones API Backend Testing Suite
Tests all backend endpoints for the veterinary bone study application.
"""

import requests
import json
import sys
from typing import Dict, Any

# Base URL for API testing (from frontend/.env)
BASE_URL = "https://skeletal-quiz.preview.emergentagent.com/api"

class VetBonesAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = {
            "test": test_name,
            "passed": passed,
            "details": details,
            "status": status
        }
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_get_animals(self):
        """Test GET /api/animals endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/animals", timeout=10)
            
            if response.status_code != 200:
                self.log_test(
                    "GET /api/animals - Status Code", 
                    False, 
                    f"Expected 200, got {response.status_code}"
                )
                return False
            
            data = response.json()
            
            # Check if response is a list with 3 animals
            if not isinstance(data, list) or len(data) != 3:
                self.log_test(
                    "GET /api/animals - Response Structure", 
                    False, 
                    f"Expected list of 3 animals, got {type(data)} with length {len(data) if isinstance(data, list) else 'N/A'}"
                )
                return False
            
            # Check if horse is available and others are coming soon
            horse_found = False
            cow_coming_soon = False
            pig_coming_soon = False
            
            for animal in data:
                if animal.get("id") == "horse" and animal.get("available") == True:
                    horse_found = True
                elif animal.get("id") == "cow" and animal.get("available") == False:
                    cow_coming_soon = True
                elif animal.get("id") == "pig" and animal.get("available") == False:
                    pig_coming_soon = True
            
            if not (horse_found and cow_coming_soon and pig_coming_soon):
                self.log_test(
                    "GET /api/animals - Animal Availability", 
                    False, 
                    f"Expected horse=True, cow=False, pig=False. Got: {[(a.get('id'), a.get('available')) for a in data]}"
                )
                return False
            
            self.log_test("GET /api/animals - Complete", True, "All 3 animals returned with correct availability")
            return True
            
        except Exception as e:
            self.log_test("GET /api/animals - Exception", False, str(e))
            return False

    def test_get_regions_horse(self):
        """Test GET /api/regions/horse endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/regions/horse", timeout=10)
            
            if response.status_code != 200:
                self.log_test(
                    "GET /api/regions/horse - Status Code", 
                    False, 
                    f"Expected 200, got {response.status_code}"
                )
                return False
            
            data = response.json()
            
            # Check if response has 5 regions
            if not isinstance(data, list) or len(data) != 5:
                self.log_test(
                    "GET /api/regions/horse - Count", 
                    False, 
                    f"Expected 5 regions, got {len(data) if isinstance(data, list) else 'not a list'}"
                )
                return False
            
            # Check for required regions
            expected_regions = ["cabeza", "columna_vertebral", "torax", "extremidad_anterior", "extremidad_posterior"]
            region_ids = [region.get("id") for region in data]
            
            if not all(region in region_ids for region in expected_regions):
                self.log_test(
                    "GET /api/regions/horse - Region IDs", 
                    False, 
                    f"Expected regions: {expected_regions}, got: {region_ids}"
                )
                return False
            
            # Check bone_count field exists for each region
            for region in data:
                if "bone_count" not in region or not isinstance(region["bone_count"], int):
                    self.log_test(
                        "GET /api/regions/horse - Bone Count", 
                        False, 
                        f"Region {region.get('id', 'unknown')} missing or invalid bone_count"
                    )
                    return False
            
            self.log_test("GET /api/regions/horse - Complete", True, f"All 5 regions with bone counts: {[(r['id'], r['bone_count']) for r in data]}")
            return True
            
        except Exception as e:
            self.log_test("GET /api/regions/horse - Exception", False, str(e))
            return False

    def test_get_bones_horse_extremidad_anterior(self):
        """Test GET /api/bones/horse/extremidad_anterior endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/bones/horse/extremidad_anterior", timeout=10)
            
            if response.status_code != 200:
                self.log_test(
                    "GET /api/bones/horse/extremidad_anterior - Status Code", 
                    False, 
                    f"Expected 200, got {response.status_code}"
                )
                return False
            
            data = response.json()
            
            if not isinstance(data, list) or len(data) == 0:
                self.log_test(
                    "GET /api/bones/horse/extremidad_anterior - Response", 
                    False, 
                    f"Expected non-empty list, got {type(data)} with length {len(data) if isinstance(data, list) else 'N/A'}"
                )
                return False
            
            # Check each bone has required fields
            required_fields = ["id", "name", "region", "description", "image_url"]
            for bone in data:
                for field in required_fields:
                    if field not in bone:
                        self.log_test(
                            "GET /api/bones/horse/extremidad_anterior - Required Fields", 
                            False, 
                            f"Bone missing field: {field}"
                        )
                        return False
            
            self.log_test("GET /api/bones/horse/extremidad_anterior - Complete", True, f"Retrieved {len(data)} bones with all required fields")
            return True
            
        except Exception as e:
            self.log_test("GET /api/bones/horse/extremidad_anterior - Exception", False, str(e))
            return False

    def test_get_exam_horse_extremidad_anterior(self):
        """Test GET /api/exam/horse/extremidad_anterior?num_questions=3 endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/exam/horse/extremidad_anterior?num_questions=3", timeout=10)
            
            if response.status_code != 200:
                self.log_test(
                    "GET /api/exam/horse/extremidad_anterior - Status Code", 
                    False, 
                    f"Expected 200, got {response.status_code}"
                )
                return False
            
            data = response.json()
            
            # Check exam structure
            if "questions" not in data or not isinstance(data["questions"], list):
                self.log_test(
                    "GET /api/exam/horse/extremidad_anterior - Structure", 
                    False, 
                    "Missing 'questions' field or not a list"
                )
                return False
            
            questions = data["questions"]
            if len(questions) != 3:
                self.log_test(
                    "GET /api/exam/horse/extremidad_anterior - Question Count", 
                    False, 
                    f"Expected 3 questions, got {len(questions)}"
                )
                return False
            
            # Check each question structure
            for i, question in enumerate(questions):
                required_fields = ["image_url", "options", "correct_answer"]
                for field in required_fields:
                    if field not in question:
                        self.log_test(
                            "GET /api/exam/horse/extremidad_anterior - Question Fields", 
                            False, 
                            f"Question {i+1} missing field: {field}"
                        )
                        return False
                
                # Check options is array of 4 items
                if not isinstance(question["options"], list) or len(question["options"]) != 4:
                    self.log_test(
                        "GET /api/exam/horse/extremidad_anterior - Options", 
                        False, 
                        f"Question {i+1} should have 4 options, got {len(question['options']) if isinstance(question['options'], list) else 'not a list'}"
                    )
                    return False
                
                # Check correct_answer is in options
                if question["correct_answer"] not in question["options"]:
                    self.log_test(
                        "GET /api/exam/horse/extremidad_anterior - Correct Answer", 
                        False, 
                        f"Question {i+1} correct_answer not in options"
                    )
                    return False
            
            self.log_test("GET /api/exam/horse/extremidad_anterior - Complete", True, "Exam with 3 questions, each with 4 options and correct answers")
            return True
            
        except Exception as e:
            self.log_test("GET /api/exam/horse/extremidad_anterior - Exception", False, str(e))
            return False

    def test_get_bone_scapula_01(self):
        """Test GET /api/bone/scapula_01 endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/bone/scapula_01", timeout=10)
            
            if response.status_code != 200:
                self.log_test(
                    "GET /api/bone/scapula_01 - Status Code", 
                    False, 
                    f"Expected 200, got {response.status_code}"
                )
                return False
            
            data = response.json()
            
            # Check bone detail has required fields
            required_fields = ["id", "name", "region", "description", "image_url"]
            for field in required_fields:
                if field not in data:
                    self.log_test(
                        "GET /api/bone/scapula_01 - Required Fields", 
                        False, 
                        f"Missing field: {field}"
                    )
                    return False
            
            # Check it's the correct bone
            if data.get("id") != "scapula_01":
                self.log_test(
                    "GET /api/bone/scapula_01 - Bone ID", 
                    False, 
                    f"Expected id 'scapula_01', got '{data.get('id')}'"
                )
                return False
            
            self.log_test("GET /api/bone/scapula_01 - Complete", True, f"Bone detail returned: {data.get('name', 'Unknown')}")
            return True
            
        except Exception as e:
            self.log_test("GET /api/bone/scapula_01 - Exception", False, str(e))
            return False

    def test_error_case_invalid_animal(self):
        """Test error case: GET /api/regions/invalid_animal should return 404"""
        try:
            response = self.session.get(f"{self.base_url}/regions/invalid_animal", timeout=10)
            
            if response.status_code != 404:
                self.log_test(
                    "GET /api/regions/invalid_animal - Error Case", 
                    False, 
                    f"Expected 404 for invalid animal, got {response.status_code}"
                )
                return False
            
            self.log_test("GET /api/regions/invalid_animal - Error Case", True, "Correctly returned 404 for invalid animal")
            return True
            
        except Exception as e:
            self.log_test("GET /api/regions/invalid_animal - Exception", False, str(e))
            return False

    def run_all_tests(self):
        """Run all tests and provide summary"""
        print("=" * 60)
        print("VetBones API Backend Testing Suite")
        print("=" * 60)
        print(f"Base URL: {self.base_url}")
        print()
        
        tests = [
            self.test_get_animals,
            self.test_get_regions_horse,
            self.test_get_bones_horse_extremidad_anterior,
            self.test_get_exam_horse_extremidad_anterior,
            self.test_get_bone_scapula_01,
            self.test_error_case_invalid_animal
        ]
        
        for test in tests:
            test()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed_tests = [r for r in self.test_results if r["passed"]]
        failed_tests = [r for r in self.test_results if not r["passed"]]
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"Passed: {len(passed_tests)}")
        print(f"Failed: {len(failed_tests)}")
        print()
        
        if failed_tests:
            print("FAILED TESTS:")
            for test in failed_tests:
                print(f"  ❌ {test['test']}: {test['details']}")
            print()
        
        if passed_tests:
            print("PASSED TESTS:")
            for test in passed_tests:
                print(f"  ✅ {test['test']}")
        
        print("=" * 60)
        return len(failed_tests) == 0

if __name__ == "__main__":
    tester = VetBonesAPITester()
    success = tester.run_all_tests()
    
    if not success:
        sys.exit(1)
    else:
        print("All tests passed! ✅")
        sys.exit(0)