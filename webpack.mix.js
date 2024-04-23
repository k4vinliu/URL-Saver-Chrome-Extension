let mix = require('laravel-mix')

mix.webpackConfig(webpack => {
    return {
        plugins: [
            new webpack.DefinePlugin({
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
            }),
        ],
    }
})

mix.options({
    terser: {
        extractComments: false,
        terserOptions: {
            output: {
                comments: false
            }
        }
    }
})
.setPublicPath('./')
.copy(['src/manifest.json', 'src/popup.html'], 'dist')
.copy('src/icons/', 'dist/icons')
.js('src/js/popup.js', 'dist/js').vue()