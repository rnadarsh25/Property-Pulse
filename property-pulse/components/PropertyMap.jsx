'use client';
import { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker } from 'react-map-gl';
import { setDefaults, fromAddress } from 'react-geocode';
import Spinner from './Spinner';
import Image from 'next/image';
import pin from '@/assets/images/pin.svg';

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: '100%',
    height: '500px',
  });
  const [loading, setLoading] = useState(false);
  const [geoCodeError, setGeoCodeError] = useState(true);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: 'en',
    region: 'us',
  });

  useEffect(() => {
    try {
      const fetchCoords = async () => {
        const res = await fromAddress(
          `${property.location.street}${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );
        if (!res?.results?.length)
          throw new Error('fetching location is failed!');
        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      };
      //   fetchCoords(); //call this function once google cloud api token setup is done, currently it's paid
    } catch (error) {
      console.error({ error });
      setGeoCodeError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <Spinner loading={loading} />;
  if (geoCodeError) {
    return <div className='text-xl'>No location data found!</div>;
  }

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapLib={import('mapbox-gl')}
      initialViewState={{
        latitude: lat,
        longitude: lng,
        zoom: 15,
      }}
      style={{
        width: '100%',
        height: 500,
      }}
      mapStyle='mapbox://styles/mapbox/streets-v9'
    >
      <Marker longitude={lng} latitude={lat} anchor='bottom'>
        <Image src={pin} alt='location' width={40} height={40} />
      </Marker>
    </Map>
  );
};

export default PropertyMap;
