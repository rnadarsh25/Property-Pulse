import connectDB from '@/config/db';
import Property from '@/models/Property';

export const GET = async (request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');
    const locationPattern = new RegExp(location, 'i');
    const query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { 'location.street': locationPattern },
        { 'location.city': locationPattern },
        { 'location.state': locationPattern },
        { 'location.zipcode': locationPattern },
      ],
    };

    if (propertyType && propertyType !== 'All') {
      const propertyTypePattern = new RegExp(propertyType, 'i');
      query.type = propertyTypePattern;
    }

    const properties = await Property.find(query);
    return Response.json(properties, { status: 200 });
  } catch (error) {
    console.log({ error });
    return new Response('Something went wrong', { status: 500 });
  }
};
