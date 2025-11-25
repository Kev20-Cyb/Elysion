#!/usr/bin/env python3
"""
Script to clean all user accounts and password reset tokens from the database
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import asyncio

# Load environment variables
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def clean_database():
    """Clean all user accounts and password reset tokens"""
    
    print("🧹 Nettoyage de la base de données...")
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Delete all users
        users_result = await db.users.delete_many({})
        print(f"✅ {users_result.deleted_count} comptes utilisateurs supprimés")
        
        # Delete all password reset tokens
        resets_result = await db.password_resets.delete_many({})
        print(f"✅ {resets_result.deleted_count} tokens de réinitialisation supprimés")
        
        # Verify collections are empty
        users_count = await db.users.count_documents({})
        resets_count = await db.password_resets.count_documents({})
        
        print(f"\n📊 État final de la base de données :")
        print(f"   - Utilisateurs restants : {users_count}")
        print(f"   - Tokens de réinitialisation restants : {resets_count}")
        
        if users_count == 0 and resets_count == 0:
            print("\n✅ Base de données nettoyée avec succès !")
        else:
            print("\n⚠️ Attention : des données restent dans la base")
            
    except Exception as e:
        print(f"❌ Erreur lors du nettoyage : {str(e)}")
        
    finally:
        client.close()
        print("\n🔒 Connexion à la base de données fermée")

if __name__ == "__main__":
    asyncio.run(clean_database())
