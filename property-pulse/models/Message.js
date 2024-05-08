import { Schema, models, model } from 'mongoose';

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
});

const Message = models.Message || model('Message', MessageSchema);
export default Message;
