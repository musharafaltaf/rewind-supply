
import mongoose, { Schema, Model } from "mongoose";

interface IOrder {
  userId?: mongoose.Types.ObjectId;
  items?: any[];
  total?: number;
codFee?: number;
onlineDiscount?: number;
status?: string;
  customer?: any;
  paymentMethod?: string;
  paymentProof?: string | null;

  // UPI payment verification
  paymentStatus?: string;
  upiApp?: string;
  upiTransactionId?: string;
  paymentScreenshot?: string;
  paymentSubmittedAt?: Date;
  paymentVerifiedAt?: Date;
  paymentVerifiedBy?: string;
  paymentRejectionReason?: string;

  tracking?: {
    status: string;
    date: Date;
  }[];

  // =========================
  // RETURN SYSTEM
  // =========================
  returnRequest?: {
    requested: boolean;
    reason?: string;
    description?: string;
    images?: string[];
    status?: string;
    charge?: number;
    refundAmount?: number;
    refundMethod?: string;
    refundDetails?: {
      accountHolder?: string;
      bankName?: string;
      accountNumber?: string;
      ifsc?: string;
      upiId?: string;
    };
    refundStatus?: string;
    pickup?: {
      date?: Date;
      slot?: string;
      address?: string;
      courier?: string;
      trackingNumber?: string;
    };
    timeline?: {
      status: string;
      date: Date;
    }[];
    requestedAt?: Date;
    approvedAt?: Date;
    completedAt?: Date;
  };

  // =========================
  // EXCHANGE SYSTEM
  // =========================
  exchangeRequest?: {
    requested: boolean;
    reason?: string;
    description?: string;
    images?: string[];
    originalProduct?: {
      id?: string;
      name?: string;
      image?: string;
      size?: string;
      price?: number;
    };
    replacementProduct?: {
      id?: string;
      name?: string;
      image?: string;
      size?: string;
      price?: number;
    };
    replacementOrderId?: string;
    newSize?: string;
    charge?: number;
    paymentMethod?: string;
    paymentProof?: string;
    status?: string;
    pickup?: {
      date?: Date;
      slot?: string;
      courier?: string;
      trackingNumber?: string;
    };
    timeline?: {
      status: string;
      date: Date;
    }[];
    requestedAt?: Date;
    approvedAt?: Date;
    completedAt?: Date;
  };
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    items: Array,

total: Number,

codFee: {
  type: Number,
  default: 0,
},

onlineDiscount: {
  type: Number,
  default: 0,
},

status: String,
    customer: Schema.Types.Mixed,
    paymentMethod: String,
    paymentProof: String,

    // UPI payment verification
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "verification_pending", "paid", "failed", "rejected"],
    },
    upiApp: String,
    upiTransactionId: String,
    paymentScreenshot: String,
    paymentSubmittedAt: Date,
    paymentVerifiedAt: Date,
    paymentVerifiedBy: String,
    paymentRejectionReason: String,

    // =========================
    // ORDER TRACKING
    // =========================
    tracking: [
      {
        status: String,
        date: Date,
      },
    ],

    // =========================
    // RETURN SYSTEM
    // =========================
    returnRequest: {
      requested: { type: Boolean, default: false },
      reason: String,
      description: String,
      images: [String],
      status: {
        type: String,
        enum: [
          "none",
          "requested",
          "payment_pending",
          "payment_done",
          "approved",
          "pickup_scheduled",
          "pickup_completed",
          "refund_processing",
          "completed",
          "rejected",
        ],
        default: "none",
      },
      charge: {
        type: Number,
        default: 70,
      },
      refundAmount: Number,
      refundMethod: String,
      refundDetails: {
        accountHolder: String,
        bankName: String,
        accountNumber: String,
        ifsc: String,
        upiId: String,
      },
      refundStatus: {
        type: String,
        enum: ["none", "pending", "processing", "completed"],
        default: "none",
      },
      pickup: {
        date: Date,
        slot: String,
        address: String,
        courier: String,
        trackingNumber: String,
      },
      timeline: [
        {
          status: String,
          date: Date,
        },
      ],
      requestedAt: Date,
      approvedAt: Date,
      completedAt: Date,
    },

    // =========================
    // EXCHANGE SYSTEM
    // =========================
    exchangeRequest: {
      requested: { type: Boolean, default: false },
      reason: String,
      description: String,
      images: [String],
      originalProduct: {
        id: String,
        name: String,
        image: String,
        size: String,
        price: Number,
      },
      replacementProduct: {
        id: String,
        name: String,
        image: String,
        size: String,
        price: Number,
      },

      // LINK TO REPLACEMENT ORDER
      replacementOrderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
      newSize: String,
      charge: {
        type: Number,
        default: 70,
      },
      paymentMethod: String,
      paymentProof: String,
      status: {
        type: String,
        enum: [
          "none",
          "requested",
          "payment_pending",
          "payment_done",
          "approved",
          "pickup_scheduled",
          "pickup_completed",
          "replacement_shipped",
          "completed",
          "rejected",
          "cancelled",
        ],
        default: "none",
      },
      pickup: {
        date: Date,
        slot: String,
        courier: String,
        trackingNumber: String,
      },
      timeline: [
        {
          status: String,
          date: Date,
        },
      ],
      requestedAt: Date,
      approvedAt: Date,
      completedAt: Date,
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;