'''
Business: Get all orders from database for admin dashboard
Args: event with GET request
Returns: List of orders with status and details
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT 
                order_id, 
                package_id, 
                uc_amount, 
                price, 
                player_id, 
                email, 
                status, 
                payment_id,
                created_at,
                updated_at
            FROM orders 
            ORDER BY created_at DESC 
            LIMIT 100
        """)
        
        orders = cur.fetchall()
        
        orders_list = []
        for order in orders:
            orders_list.append({
                'order_id': order['order_id'],
                'package_id': order['package_id'],
                'uc_amount': order['uc_amount'],
                'price': order['price'],
                'player_id': order['player_id'],
                'email': order['email'],
                'status': order['status'],
                'payment_id': order['payment_id'],
                'created_at': order['created_at'].isoformat() if order['created_at'] else None,
                'updated_at': order['updated_at'].isoformat() if order['updated_at'] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'orders': orders_list}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
