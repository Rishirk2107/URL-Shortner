import json
import boto3
import hashlib

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ShortUrls')

BASE_URL = 'https://api.byteblazeverse.space/'

def lambda_handler(event, context):
    body = json.loads(event['body'])
    long_url = body.get('longUrl')
    self_destruct = body.get('selfDestruct', False)

    if not long_url:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'error': 'longUrl is required'})
        }

    short_id = hashlib.md5(long_url.encode()).hexdigest()[:6]

    table.put_item(Item={
        'shortId': short_id,
        'longUrl': long_url,
        'selfDestruct': bool(self_destruct)
    })

    short_url = f"{BASE_URL}{short_id}"
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps({'shortUrl': short_url})
    }
