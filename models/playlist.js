const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: '' },
  coverUrl: { type: String, default: '' }, // 곡 커버 or 출처
  audioUrl: { type: String, default: '' }, // 🔹 업로드된 음원 파일 경로
}, { _id: false });

const playlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, default: 'My Playlist' },
  description: { type: String, default: '' },
  tracks: { type: [trackSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
