'''
Business: Handle YooKassa payment notifications and update order status
Args: event with POST body containing YooKassa notification
Returns: Success response
'''
import json
import os
from typing import Dict, Any
import psycopg2

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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        notification_type = body.get('event')
        payment_object = body.get('object', {})
        payment_id = payment_object.get('id')
        status = payment_object.get('status')
        metadata = payment_object.get('metadata', {})
        order_id = metadata.get('order_id')
        
        if not order_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'No order_id in metadata'})
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        new_status = 'pending'
        if status == 'succeeded':
            new_status = 'paid'
        elif status == 'canceled':
            new_status = 'cancelled'
        
        cur.execute(
            "UPDATE orders SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE order_id = %s",
            (new_status, order_id)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'status': 'ok'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
