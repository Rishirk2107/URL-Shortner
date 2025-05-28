import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ShortUrls')

def lambda_handler(event, context):
    short_id = event['pathParameters']['shortId']

    response = table.get_item(Key={'shortId': short_id})
    item = response.get('Item')

    if not item:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'URL not found'})
        }

    long_url = item['longUrl']

    if item.get('selfDestruct'):
        table.delete_item(Key={'shortId': short_id})

    return {
        'statusCode': 302,
        'headers': {
            'Location': long_url
        }
    }
