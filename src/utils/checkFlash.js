/* eslint-disable */
export default function checkFlash () {
  var hasFlash = 0;
  var flashVersion = 0;
  var swf = null;
  //document.all为IE下，document.getElementsByTagName("*")为非IE
  if (document.all || document.getElementsByTagName("*")) {
    try {
      swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      if (swf) {
        hasFlash = 1;
        VSwf = swf.GetVariable("$version");
        flashVersion = parseInt(VSwf.split(" ")[0].split(",")[0]);
      }
    } catch (e) {
      //catch不能做处理，而且必须要捕捉;
      //否则在firefox,下，ActiveXObject会出错，下面的代码不会再去执行
    }
    if (!swf) {
      //navigator首字母必须是小写，大写是错误的
      if (navigator.plugins && navigator.plugins.length > 0) {
        var swf = navigator.plugins["Shockwave Flash"];
        if (swf) {
          hasFlash = 1;
          var words = swf.description.split(" ");
          for (var i = 0; i < words.length; i++) {
            if (isNaN(parseInt(words[i]))) {
              continue;
            }
            flashVersion = parseInt(words[i]);
          }
        }
      }
    }
  }
  return { f: hasFlash, v: flashVersion }
}
