#!/usr/bin/env python3
"""
Backend Test Suite for Elysion Retirement Platform
Testing the forgot password flow as requested
"""

import requests
import json
import re
from datetime import datetime

# Configuration
BASE_URL = "https://future-nest-1.preview.emergentagent.com/api"
TEST_EMAIL = "test@example.com"
NEW_PASSWORD = "nouveau123"

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}")

def print_result(success, message, details=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    if details:
        print(f"Details: {details}")

def test_forgot_password_flow():
    """Test the complete forgot password flow"""
    
    print_test_header("Forgot Password Flow Test")
    print(f"Backend URL: {BASE_URL}")
    print(f"Test Email: {TEST_EMAIL}")
    print(f"New Password: {NEW_PASSWORD}")
    
    # Step 1: Test forgot password endpoint
    print_test_header("Step 1: POST /api/auth/forgot-password")
    
    try:
        forgot_password_data = {"email": TEST_EMAIL}
        response = requests.post(
            f"{BASE_URL}/auth/forgot-password",
            json=forgot_password_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            # Check if response contains confirmation message
            if "message" in response_data:
                print_result(True, "Forgot password endpoint returned confirmation message")
                print(f"Message: {response_data['message']}")
            else:
                print_result(False, "Response missing confirmation message")
                return False
            
            # Check if response contains reset_link (MVP feature)
            if "reset_link" in response_data:
                print_result(True, "Response contains reset_link (MVP feature)")
                reset_link = response_data["reset_link"]
                print(f"Reset Link: {reset_link}")
                
                # Extract token from reset_link
                token_match = re.search(r'token=([^&]+)', reset_link)
                if token_match:
                    reset_token = token_match.group(1)
                    print_result(True, f"Successfully extracted token from reset_link")
                    print(f"Extracted Token: {reset_token[:50]}...")
                else:
                    print_result(False, "Could not extract token from reset_link")
                    return False
            else:
                print_result(False, "Response missing reset_link (required for MVP)")
                return False
                
        else:
            print_result(False, f"Forgot password request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result(False, f"Network error during forgot password request: {str(e)}")
        return False
    except Exception as e:
        print_result(False, f"Unexpected error during forgot password request: {str(e)}")
        return False
    
    # Step 2: Test reset password endpoint
    print_test_header("Step 2: POST /api/auth/reset-password")
    
    try:
        reset_password_data = {
            "token": reset_token,
            "new_password": NEW_PASSWORD
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/reset-password",
            json=reset_password_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if "message" in response_data:
                print_result(True, "Reset password endpoint returned confirmation message")
                print(f"Message: {response_data['message']}")
            else:
                print_result(False, "Reset password response missing confirmation message")
                return False
                
        else:
            print_result(False, f"Reset password request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result(False, f"Network error during reset password request: {str(e)}")
        return False
    except Exception as e:
        print_result(False, f"Unexpected error during reset password request: {str(e)}")
        return False
    
    # Step 3: Test authentication with new password
    print_test_header("Step 3: POST /api/auth/login (verify new password)")
    
    try:
        login_data = {
            "email": TEST_EMAIL,
            "password": NEW_PASSWORD
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response Data Keys: {list(response_data.keys())}")
            
            # Check for required fields in login response
            required_fields = ["access_token", "token_type", "user"]
            missing_fields = [field for field in required_fields if field not in response_data]
            
            if not missing_fields:
                print_result(True, "Login successful with new password - all required fields present")
                print(f"Token Type: {response_data.get('token_type')}")
                print(f"User Email: {response_data.get('user', {}).get('email')}")
                print(f"Access Token: {response_data.get('access_token', '')[:50]}...")
            else:
                print_result(False, f"Login response missing required fields: {missing_fields}")
                return False
                
        elif response.status_code == 401:
            print_result(False, "Login failed - new password not working (401 Unauthorized)")
            print(f"Response: {response.text}")
            return False
        else:
            print_result(False, f"Login request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result(False, f"Network error during login request: {str(e)}")
        return False
    except Exception as e:
        print_result(False, f"Unexpected error during login request: {str(e)}")
        return False
    
    return True

def test_additional_scenarios():
    """Test additional scenarios for robustness"""
    
    print_test_header("Additional Test Scenarios")
    
    # Test 1: Invalid email format
    print("\n--- Test: Invalid email format ---")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/forgot-password",
            json={"email": "invalid-email"},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 422:
            print_result(True, "Correctly rejected invalid email format (422)")
        else:
            print_result(False, f"Expected 422 for invalid email, got {response.status_code}")
            
    except Exception as e:
        print_result(False, f"Error testing invalid email: {str(e)}")
    
    # Test 2: Invalid reset token
    print("\n--- Test: Invalid reset token ---")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/reset-password",
            json={"token": "invalid-token", "new_password": "newpass123"},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 400:
            print_result(True, "Correctly rejected invalid reset token (400)")
        else:
            print_result(False, f"Expected 400 for invalid token, got {response.status_code}")
            
    except Exception as e:
        print_result(False, f"Error testing invalid token: {str(e)}")

def main():
    """Main test execution"""
    print("🚀 Starting Elysion Backend Tests")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    # Test the main forgot password flow
    main_flow_success = test_forgot_password_flow()
    
    # Test additional scenarios
    test_additional_scenarios()
    
    # Final summary
    print_test_header("TEST SUMMARY")
    if main_flow_success:
        print("✅ OVERALL RESULT: Forgot Password Flow - WORKING")
        print("✅ All critical functionality verified:")
        print("   - Forgot password endpoint responds correctly")
        print("   - Reset link contains valid token")
        print("   - Password reset works with token")
        print("   - Login works with new password")
    else:
        print("❌ OVERALL RESULT: Forgot Password Flow - FAILED")
        print("❌ Critical issues found in the flow")
    
    print(f"\nTest completed at: {datetime.now().isoformat()}")

if __name__ == "__main__":
    main()