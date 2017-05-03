  var fs = require('fs');
  var qrCodeLogo = require('qrcode-logo');

  module.exports = {
      index: function(req, res){
          sails.log.info(sails.config.appUrl);
          var url = 'Handcrafted-Forest-Mug-1';
          var qrcodeImgFilePath = 'assets/images/qr_logo.png';
          var logoBuffer = fs.readFileSync('assets/images/sample_logo.png', {
              encoding: null
          });

          qrCodeLogo(url, qrcodeImgFilePath, {
            size: 10,  // 二维码单位块大小
            logo: logoBuffer // logo数据
          }, function(err, image) {
            if (err) {
              sails.log.error("errrr" + err);
            }
            sails.log.info("image: " + image)
            var data = {
              'url' : 'images/qr_logo.png'
            }
            return res.view('qr/index', data)
          });


      }
  };
