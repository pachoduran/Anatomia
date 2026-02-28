#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Aplicación móvil para estudiar el sistema óseo de animales (caballos), con exámenes de selección múltiple e imágenes anatómicas reales para veterinarios"

backend:
  - task: "GET /api/animals - Listar animales disponibles"
    implemented: true
    working: true
    file: "server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Endpoint implementado, retorna lista de animales con caballo disponible y vaca/cerdo como próximamente"
      - working: true
        agent: "testing"
        comment: "TESTED: Returns 3 animals (horse available=True, cow/pig available=False). Status 200 OK. All required fields present."

  - task: "GET /api/regions/{animal_id} - Obtener regiones anatómicas"
    implemented: true
    working: true
    file: "server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Retorna 5 regiones anatómicas del caballo: cabeza, columna vertebral, tórax, extremidad anterior y posterior"
      - working: true
        agent: "testing"
        comment: "TESTED: Returns 5 regions (cabeza, columna_vertebral, torax, extremidad_anterior, extremidad_posterior) with bone_count field. Status 200 OK. Error case 404 for invalid animal working."

  - task: "GET /api/exam/{animal_id}/{region_id} - Generar examen de selección múltiple"
    implemented: true
    working: true
    file: "server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Genera examen con preguntas aleatorias, opciones múltiples y respuestas correctas para la región seleccionada"
      - working: true
        agent: "testing"
        comment: "TESTED: Generates exam with requested num_questions parameter (tested with 3 questions). Each question has image_url, 4 options, correct_answer in options. All fields validated."

  - task: "GET /api/bones/{animal_id}/{region_id} - Obtener huesos por región"
    implemented: true
    working: true
    file: "server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Retorna lista de huesos con nombre, descripción, imagen URL para cada región"
      - working: true
        agent: "testing"
        comment: "TESTED: Returns bones list with all required fields (id, name, region, description, image_url). Tested multiple regions (extremidad_anterior: 6 bones, torax: 3 bones)."

  - task: "GET /api/bone/{bone_id} - Obtener detalle de hueso específico"
    implemented: true
    working: true
    file: "server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "testing"
        comment: "TESTED: Returns bone detail with all required fields. Tested with scapula_01 bone. Status 200 OK."

frontend:
  - task: "Pantalla principal - Selección de animal"
    implemented: true
    working: true
    file: "app/index.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "UI funcional con tarjetas de animales, caballo disponible, vaca/cerdo deshabilitados"

  - task: "Pantalla regiones - Selección de región anatómica"
    implemented: true
    working: true
    file: "app/regions/[animalId].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Lista las 5 regiones con iconos, descripción y cantidad de huesos"

  - task: "Pantalla examen - Quiz de selección múltiple"
    implemented: true
    working: true
    file: "app/exam/[animalId]/[regionId].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Examen funcional con imágenes anatómicas reales de UC Davis, opciones múltiples, feedback visual correcto/incorrecto"

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "MVP completado. Backend con 4 endpoints principales para animales, regiones, huesos y exámenes. Frontend con 3 pantallas navegables. Imágenes anatómicas reales de UC Davis Veterinary. Necesito pruebas de backend con curl para verificar todos los endpoints."
  - agent: "testing"
    message: "BACKEND TESTING COMPLETE: All 5 endpoints tested successfully. Created comprehensive backend_test.py with 6 test cases. All APIs return 200 OK with correct data structures. Error handling (404 for invalid animals) working correctly. Exam generation with customizable questions, bone details, and region listings all functional. NO CRITICAL ISSUES FOUND."