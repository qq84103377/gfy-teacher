export default {
  methods: {
    multipleUpload(result) {
      this.$store.commit('setVanLoading', true)
      let arr = []
      result.images.forEach(v => {
        arr.push(this.imgToBase64(v.path))
      })
      let uploadArr = []
      Promise.all(arr).then(res => {
        res.forEach(v => {
          uploadArr.push(this.base64toFile(v))
        })
        Promise.all(uploadArr).then(r => {
          this.$store.commit('setVanLoading', false)
        }).catch(e => {
          this.$store.commit('setVanLoading', false)
        })
      }).catch(err => {
        this.$store.commit('setVanLoading', false)
      })
    },
    imgToBase64(url) {
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image;
      img.crossOrigin = 'Anonymous';
      img.src = url;
      return new Promise( (resolve, reject) => {
        img.onload = () => {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL('image/png');
          img = null
          canvas = null;
          resolve(dataURL);
        }
        img.onerror = function(err){
          reject(err)
        }
      })

    },
    base64toFile(imgBase) {
      try {
        var arr = imgBase.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        let curFile = new Blob([u8arr], {type: mime});
        // if (this.oSSObject == null) {
        //   this.getOSSKey();
        // }
        console.log("file");

        console.log(curFile);
        return this.uploadIMG(curFile);
      } catch (e) {
        console.log(e)
      }
    },

  }
}
