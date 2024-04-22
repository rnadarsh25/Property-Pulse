import connectDB from '@/config/db';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';

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

// DELETE --> /api/properties
export const DELETE = async (request, { params }) => {
  try {
    const id = params.id;
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId)
      return new Response('User id is required!', { status: 401 });

    const { userId } = sessionUser;
    await connectDB();

    const property = await Property.findById({ _id: id });

    if (!property) return new Response('Property not found!', { status: 404 });

    if (property.owner.toString() !== userId)
      return new Response('Unauthorized User!', { status: 401 });

    await property.deleteOne();

    return new Response('Property Deleted!', { status: 200 });
  } catch (err) {
    console.log({ err });
    return new Response('Something went wrong', { status: 500 });
  }
};

// PUT --> /api/properties/:id
export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const { userId = '' } = await getSessionUser();
    const { id = '' } = params;
    if (!userId) return new Response('Unauthorized User!', { status: 401 });
    const formData = await request.formData();

    //for array use getAll else use get
    const amenities = formData.getAll('amenities');

    const existingProperty = await Property.findById(id);

    if (!existingProperty)
      return new Response('Property does not exists!', { status: 404 });
    if (existingProperty.owner.toString() !== userId)
      return new Response('Unauthorized to perform the operation!', {
        status: 401,
      });

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
      owner: userId,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return Response.json(updatedProperty, {
      status: 200,
    });
  } catch (error) {
    console.log({ error });
    return new Response('Failed to add new property', { status: 500 });
  }
};
