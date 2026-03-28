import mongoose, { Schema, Document } from "mongoose";
import { analyzePortfolio } from "../utils/analytics"; // <--- Import this


// 1. Sub-document for individual funds
interface IHolding {
  schemeName: string;
  folioNumber: string;
  units: number;
  currentValue: number;
  category: "EQUITY" | "DEBT" | "GOLD" | "HYBRID" | "OTHER";
}

// 2. Main Document Interface
export interface IPortfolio extends Document {
  userId: string;
  statementDate: Date;
  holdings: IHolding[];
  summary: {
    totalValue: number;
  };
  insights?: {
    metrics: {
      totalValue: number;
      riskScore: number;
      riskLabel: string;
      expenseRatioDrag: number;
      overlapCount: number;
      xirr: number;
      assetQuality: string;
    };
    allocation: {
      equity: number;
      debt: number;
    };
  };
}

// 3. Schema Definition
const HoldingSchema = new Schema<IHolding>({
  schemeName: { type: String, required: true },
  folioNumber: { type: String, default: "N/A" },
  units: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  category: { type: String, default: "OTHER" }
});

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: String, required: true }, // We will link this to Clerk later
  statementDate: { type: Date, default: Date.now },
  holdings: [HoldingSchema],
  summary: {
    totalValue: { type: Number, default: 0 }
  },
  insights: {
    metrics: {
      totalValue: { type: Number },
      riskScore: { type: Number },
      riskLabel: { type: String },
      expenseRatioDrag: { type: Number },
      overlapCount: { type: Number },
      xirr: { type: Number },
      assetQuality: { type: String }
    },
    allocation: {
      equity: { type: Number },
      debt: { type: Number }
    }
  }
}, { timestamps: true });



export const Portfolio = mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
