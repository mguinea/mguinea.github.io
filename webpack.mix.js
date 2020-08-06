const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
require('laravel-mix-purgecss');

mix.sass('resources/sass/app.scss', 'assets')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.config.js')],
    })
    .purgeCss({
        enabled: mix.inProduction(),
        folders: ['resources'],
        extensions: ['html', 'js', 'php', 'vue']
    });
