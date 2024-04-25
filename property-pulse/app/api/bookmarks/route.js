import connectDB from '@/config/db';
import User from '@/models/User';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/bookmarks

export const GET = async () => {
  try {
    await connectDB();
    const session = await getSessionUser();
    if (!session || !session.userId) {
      return new Response('User ID is required!', { status: 404 });
    }
    const { userId } = session;

    const user = await User.findOne({ _id: userId });
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });
    return Response.json({ bookmarks }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return new Response('Something went wrong', { status: 500 });
  }
};

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
    let message;
    if (isBookmarked) {
      user.bookmarks.pull(propertyId);
      message = 'Bookmark removed successfully!';
      isBookmarked = false;
    } else {
      user.bookmarks.push(propertyId);
      message = 'Bookmark added successfully!';
      isBookmarked = true;
    }
    await user.save();
    return Response.json({ message, isBookmarked }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return Response.json({ message: 'Something went wrong!' }, { status: 500 });
  }
};
