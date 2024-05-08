import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

export const ShareButtons = ({ property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  return (
    <>
      <h1 className='text-xl font-bold text-center pt-2'>Share Properties</h1>
      <div className='flex gap-3 justify-center pb-5'>
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag={`#${property.type.replace(/\s/g, '')}ForRent`}
        >
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={property.name}
          hashtags={[`#${property.type.replace(/\s/g, '')}ForRent`]}
        >
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={property.name}
          separator={':: '}
        >
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          title={property.name}
          body={`Check out this property listing: ${shareUrl}`}
        >
          <EmailIcon size={40} round={true} />
        </EmailShareButton>
      </div>
    </>
  );
};
