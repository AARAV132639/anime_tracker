/**
 * Defined anime data structure in databus
 * Every anime will have: Title, status and notes
 */

import mongoose from "mongoose";

const AnimeSchema= new mongoose.Schema({
    title: String,
    status:{
        type: String,
        enum:["plan","watched"],
        default:"plan",
    },
    notes: String,
});

export default mongoose.models.Anime||mongoose.model("Anime", AnimeSchema);