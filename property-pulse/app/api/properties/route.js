import connectDB from '@/config/db';
import Property from '@/models/Property';

// GET --> /api/properties
export const GET = async () => {
  try {
    await connectDB();
    const properties = await Property.find({});
    return Response.json(properties);
  } catch (err) {
    console.log({ err });
    return new Response('Something went wrong', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const formData = await request.formData();

    //for array use getAll else use get
    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image.name);

    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        nightly: formData.get('rates.nightly'),
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      images,
    };

    console.log(propertyData);

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
    });
  } catch (error) {
    console.log({ error });
    return new Response('Failed to add new property', { status: 500 });
  }
};
