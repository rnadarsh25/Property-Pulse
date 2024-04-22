'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import profileDefault from '@/assets/images/profile.png';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  const handleDeleteProperty = async (propertyId) => {
    try {
      const confirmed = window.confirm(
        'Are you sure want to delete this property'
      );
      if (!confirmed) return;
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      if (res.status === 200) {
        const updatedProperties = properties.filter(
          (property) => property._id !== propertyId
        );
        setProperties(updatedProperties);
        toast.success('Property deleted successfully!');
      } else {
        toast.error('Failed to delete property!');
      }
    } catch (error) {
      console.error({ error });
      toast.error('Failed to delete property!');
    }
  };

  useEffect(() => {
    const fetchUserProperties = async () => {
      const userId = user?.id;
      if (!userId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/user/${userId}`
        );
        if (!res.ok) throw new Error('Fetching user properties failed!');
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error({ error });
        return [];
      } finally {
        setIsLoading(false);
      }
    };
    if (session?.user?.id) fetchUserProperties();
  }, [session]);

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>Your Profile</h1>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/4 mx-20 mt-10'>
              <div className='mb-4'>
                <Image
                  className='h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0'
                  src={user?.image || profileDefault}
                  alt='User'
                  width={0}
                  height={0}
                  sizes='100vw'
                />
              </div>
              <h2 className='text-2xl mb-4'>
                <span className='font-bold block'>Name: </span> {user?.name}
              </h2>
              <h2 className='text-2xl'>
                <span className='font-bold block'>Email: </span> {user?.email}
              </h2>
            </div>

            <div className='md:w-3/4 md:pl-4'>
              <h2 className='text-xl font-semibold mb-4'>Your Listings</h2>
              {!isLoading && properties.length === 0 && (
                <p>You have no property listings!</p>
              )}
              {isLoading ? (
                <Spinner />
              ) : (
                properties.map((property, index) => (
                  <div className='mb-10' key={index}>
                    <Link href={`/properties/${property._id}`}>
                      <Image
                        className='h-32 w-full rounded-md object-cover'
                        src={property.images[0]}
                        alt={property.name}
                        width={500}
                        height={100}
                        priority={true}
                      />
                    </Link>
                    <div className='mt-2'>
                      <p className='text-lg font-semibold'>{property.name}</p>
                      <p className='text-gray-600'>
                        Address: {property.location.street},{' '}
                        {property.location.city}, {property.location.state}
                      </p>
                    </div>
                    <div className='mt-2'>
                      <Link
                        href={`/properties/${property._id}/edit`}
                        className='bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600'
                        type='button'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
