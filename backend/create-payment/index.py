'''
Business: Create payment in YooKassa and save order to database
Args: event with POST body containing package_id, player_id, email
Returns: Payment URL for customer redirect
'''
import json
import os
import uuid
from typing import Dict, Any
import psycopg2
from yookassa import Configuration, Payment

Configuration.account_id = os.environ.get('YOOKASSA_SHOP_ID')
Configuration.secret_key = os.environ.get('YOOKASSA_SECRET_KEY')

PACKAGES = {
    1: {'amount': 60, 'price': 75},
    2: {'amount': 325, 'price': 380},
    3: {'amount': 660, 'price': 750},
    4: {'amount': 1800, 'price': 1990},
    5: {'amount': 3850, 'price': 3990},
    6: {'amount': 8100, 'price': 7990},
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        body = json.loads(body_str)
        package_id = body.get('package_id')
        player_id = body.get('player_id')
        email = body.get('email')
        
        if not all([package_id, player_id, email]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        package = PACKAGES.get(package_id)
        if not package:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid package_id'})
            }
        
        order_id = str(uuid.uuid4())
        
        payment = Payment.create({
            'amount': {
                'value': str(package['price']),
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': 'https://yoursite.com'
            },
            'capture': True,
            'description': f"UC {package['amount']} для PUBG",
            'metadata': {
                'order_id': order_id,
                'player_id': player_id,
                'uc_amount': package['amount']
            },
            'receipt': {
                'customer': {
                    'email': email
                },
                'items': [{
                    'description': f"Игровая валюта UC {package['amount']}",
                    'quantity': '1',
                    'amount': {
                        'value': str(package['price']),
                        'currency': 'RUB'
                    },
                    'vat_code': 1
                }]
            }
        })
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        cur.execute(
            "INSERT INTO orders (order_id, package_id, uc_amount, price, player_id, email, payment_id, payment_url, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (order_id, package_id, package['amount'], package['price'], player_id, email, payment.id, payment.confirmation.confirmation_url, 'pending')
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'order_id': order_id,
                'payment_url': payment.confirmation.confirmation_url,
                'payment_id': payment.id
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }