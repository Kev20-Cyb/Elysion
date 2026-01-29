#!/usr/bin/env python3
"""
Test edge cases for the forgot password flow
"""

import requests
import json
import re
from datetime import datetime

BASE_URL = "https://retire-planner-13.preview.emergentagent.com/api"

def test_token_reuse():
    """Test that reset tokens cannot be reused"""
    print("🔍 Testing token reuse prevention...")
    
    # First, get a reset token
    response = requests.post(
        f"{BASE_URL}/auth/forgot-password",
        json={"email": "test@example.com"},
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    if response.status_code == 200:
        reset_link = response.json().get("reset_link")
        token_match = re.search(r'token=([^&]+)', reset_link)
        if token_match:
            token = token_match.group(1)
            
            # Use the token once
            reset_response = requests.post(
                f"{BASE_URL}/auth/reset-password",
                json={"token": token, "new_password": "newpass1"},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if reset_response.status_code == 200:
                print("✅ First token use successful")
                
                # Try to use the same token again
                reuse_response = requests.post(
                    f"{BASE_URL}/auth/reset-password",
                    json={"token": token, "new_password": "newpass2"},
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                
                if reuse_response.status_code == 400:
                    print("✅ Token reuse correctly prevented (400)")
                    return True
                else:
                    print(f"❌ Token reuse not prevented (got {reuse_response.status_code})")
                    return False
            else:
                print(f"❌ First token use failed ({reset_response.status_code})")
                return False
        else:
            print("❌ Could not extract token from reset link")
            return False
    else:
        print(f"❌ Could not get reset token ({response.status_code})")
        return False

def test_nonexistent_email():
    """Test forgot password with non-existent email"""
    print("🔍 Testing forgot password with non-existent email...")
    
    response = requests.post(
        f"{BASE_URL}/auth/forgot-password",
        json={"email": "nonexistent@example.com"},
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    if response.status_code == 200:
        response_data = response.json()
        # Should return same message for security (don't reveal if email exists)
        if "reset_link" not in response_data:
            print("✅ Non-existent email handled correctly (no reset_link)")
            return True
        else:
            print("❌ Non-existent email returned reset_link (security issue)")
            return False
    else:
        print(f"❌ Unexpected status code for non-existent email: {response.status_code}")
        return False

def main():
    """Run edge case tests"""
    print("🧪 Running Edge Case Tests for Forgot Password Flow")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    results = []
    
    # Test token reuse prevention
    results.append(test_token_reuse())
    
    # Test non-existent email handling
    results.append(test_nonexistent_email())
    
    # Summary
    print("\n" + "="*60)
    print("EDGE CASE TEST SUMMARY")
    print("="*60)
    
    if all(results):
        print("✅ All edge case tests passed")
    else:
        print("❌ Some edge case tests failed")
        
    print(f"Test completed at: {datetime.now().isoformat()}")

if __name__ == "__main__":
    main()