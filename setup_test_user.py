#!/usr/bin/env python3
"""
Setup test user for forgot password flow testing
"""

import requests
import json
from datetime import datetime

BASE_URL = "https://retire-planner-13.preview.emergentagent.com/api"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"
TEST_NAME = "Test User"

def setup_test_user():
    """Create a test user for testing forgot password flow"""
    
    print("🔧 Setting up test user for forgot password flow testing")
    print(f"Email: {TEST_EMAIL}")
    print(f"Name: {TEST_NAME}")
    
    try:
        # Register test user
        user_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "full_name": TEST_NAME,
            "user_type": "employee"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Registration Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print("✅ Test user created successfully")
            print(f"User ID: {response_data.get('user', {}).get('id')}")
            return True
        elif response.status_code == 400:
            # User might already exist
            response_data = response.json()
            if "Email already registered" in response_data.get("detail", ""):
                print("✅ Test user already exists")
                return True
            else:
                print(f"❌ Registration failed: {response_data.get('detail')}")
                return False
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error setting up test user: {str(e)}")
        return False

if __name__ == "__main__":
    setup_test_user()