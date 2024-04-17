import connectDB from '@/config/db';
import Property from '@/models/Property';

// GET --> /api/properties
export const GET = async (request, { params }) => {
  try {
    const id = params.id;
    await connectDB();
    const property = await Property.findById({ _id: id });
    if (!property) return new Response('Property not found!', { status: 404 });
    return Response.json(property);
  } catch (err) {
    console.log({ err });
    return new Response('Something went wrong', { status: 500 });
  }
};
