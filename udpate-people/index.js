const dynamoose = require('dynamoose');

exports.handler = async (event) => {

  const jsonBody = JSON.parse(event.body);
 
  const peopleSchema = new dynamoose.Schema({
    'id': Number,
    'firstName': String,
    'lastName': String,
    'pob': String,
    'age': Number
  });
  
  const peopleTable = dynamoose.model('people', peopleSchema);

  let data = null;
  let status = 500;
  
  try {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    const rawData = await peopleTable.query('id').eq(+id).exec();
    if (rawData[0]){
      peopleTable.update(+id, jsonBody);
      status = 200; 
      data = "Item updated!"
    }else{
      data='Enter valid id to update!';
    };
  }catch(e) {
    data = new Error(e);
    status = 400;
  }

  const response = {
      statusCode: status,
      body: JSON.stringify(data)
  };
  return response;
};
