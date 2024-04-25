import connectDB from '@/config/db';
import User from '@/models/User';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

export const POST = async (request) => {
  try {
    await connectDB();
    const { propertyId } = await request.json();
    const session = await getSessionUser();
    if (!session || !session?.userId) {
      return new Response('USer ID is required!', { status: 401 });
    }
    const { userId } = session;

    const user = await User.findOne({ _id: userId });
    if (!user) return new Response('User not found!', { status: 404 });
    let isBookmarked = user.bookmarks.includes(propertyId);
    return Response.json({ isBookmarked }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return Response.json({ message: 'Something went wrong!' }, { status: 500 });
  }
};
