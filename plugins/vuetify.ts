// import createVuetify 
import { createVuetify } from "vuetify"

// import custom other here
// import custom icons from "@/helpers/customIcons"
import { aliases, custom } from "@/helpers/customIcons"

// import custom theme from "@/helpers/themes"
import { LIGHT_THEME, lightTheme, DARK_THEME, darkTheme } from "@/helpers/themes"

// import custom defaults from "@/helpers/defaults"
import { defaults } from "@/helpers/defaults"

// เอาที่ import ไปใส่ใน defineNuxtPlugin เพื่อไปใช้งานใน Application

// create vuetify instance
export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({

        // enable ssr for rendering
        ssr: true,

        defaults, // จาก import "@/helpers/defaults"

        theme: { // จาก import "@/helpers/themes"
            defaultTheme: LIGHT_THEME,
            themes:{
                lightTheme,
                darkTheme,
            },
            variations:{ // add color variations
                colors: ["primary","secondary"],
                lighten:3,
                darken:3,
            }
        },

        icons: { // จาก import "@/helpers/customIcons"
            defaultSet: "custom",
            aliases,
            sets:{
                custom,
            }
        }
    })

    // add vuetify to nuxt app
    nuxtApp.vueApp.use(vuetify)
})