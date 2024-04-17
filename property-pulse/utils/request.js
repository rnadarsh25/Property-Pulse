const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// fetch all properties
export async function fetchProperties() {
  try {
    //handle case when api domain is not available

    if (!apiDomain) return [];
    const res = await fetch(`${apiDomain}/properties`);
    if (!res.ok) throw new Error('Failed to fetch properties data');

    return res.json();
  } catch (err) {
    console.log({ err });
    return [];
  }
}

// fetch single property
export async function fetchProperty(id) {
  try {
    //handle case when api domain is not available

    if (!apiDomain) return null;
    const res = await fetch(`${apiDomain}/properties/${id}`);
    if (!res.ok) throw new Error('Failed to fetch property data');

    return res.json();
  } catch (err) {
    console.log({ err });
    return null;
  }
}
