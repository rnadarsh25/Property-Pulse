import connectDB from '@/config/db';
import Property from '@/models/Property';

// GET --> /api/properties/user/:userId
export const GET = async (request, { params }) => {
  try {
    const userId = params.userId;
    if (!userId) return new Response('UserId is required,', { status: 400 });
    await connectDB();
    const properties = await Property.find({ owner: userId });
    return Response.json(properties);
  } catch (err) {
    console.log({ err });
    return new Response('Something went wrong', { status: 500 });
  }
};
