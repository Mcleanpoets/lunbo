/**
 * 可按播放列表，自动播放
 * @param idOfDom video的id
 * @param filenames 文件名列表，是一个数组，不用指定目录，视频也只能放在videos
 * @param isLoop 是否循环播放
 * @constructor
 */
function PlayVideo(idOfDom, filenames, isLoop) {
  if (filenames && filenames.length) {
    // 判断是否包含#
    var id = idOfDom.indexOf("#") === 0 ? idOfDom.substring(1) : idOfDom;
    this.vid = document.getElementById(id);
    // 当前播放的序列
    this.currentIndex = 0;
    // 是否循环播放，默认不自动
    this.isLoop = isLoop || false;
    // 初始化列表
    this.playlist = filenames;
  } else {
    // 如果没有播放列表
    throw new Error("没有播放列表！");
  }
}

/**
 * 是否最后一个视频
 * @returns {boolean}
 */
PlayVideo.prototype.isLast = function () {
  return this.currentIndex + 1 >= this.playlist.length;
};

/**
 * 是否第一个视频
 * @returns {boolean}
 */
PlayVideo.prototype.isFirst = function () {
  return this.currentIndex === 0;
};

/**
 * 播放上一条
 * @returns {boolean}
 */
PlayVideo.prototype.playPrev = function () {
  if (this.isFirst()) return false;
  this.play(this.currentIndex - 1);
};

/**
 * 播放下一条
 */
PlayVideo.prototype.playNext = function () {
  var isLast = this.isLast();
  // 是否循环播放
  if (isLast && this.isLoop) {
    // 播放第一条
    this.play(0);
  } else if (isLast) {
    // 执行onEnd事件，需要订阅
    this.onEnd && this.onEnd();
  } else {
    // 播放下一条
    this.play(this.currentIndex + 1);
  }
};
/**
 * 重置
 */
PlayVideo.prototype.reset = function () {
  this.currentIndex = 0;
  this.vid.src = this.playlist[0];
};

/**
 * 播放
 * @param index // 播放列表索引
 */
PlayVideo.prototype.play = function (index) {
  // 默认播放第一条
  index = index || 0;
  this.currentIndex = index;
  // 防止闪屏
  var currentSrc = this.playlist[index];
  if (this.vid.src !== currentSrc) this.vid.src = currentSrc;
  // 播放
  this.vid.play();
  // 播放完后
  this.vid.onended = this.playNext.bind(this);
};

PlayVideo.prototype.stop = function () {
  this.vid.pause();
};
