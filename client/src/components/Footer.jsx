// import React from 'react'
// import { assets } from '../assets/assets'

// const Footer = () => {
//   return (
//     <div className='flex items-center justify-between gap-4 py-3 mt-20'>
//         <img src={assets.logo} width={150} alt="" />
//         <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @Rohit | All Right Reserved</p>
//         <div className="flex gap-3">
//             <img src={assets.facebook_icon} alt="" width={35} />
//             <img src={assets.instagram_icon} alt="" width={35} />
//             <img src={assets.twitter_icon} alt="" width={35} />
//         </div>
//     </div>
//   )
// }

// export default Footer


import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div
      className="
        flex items-center justify-between gap-4
        py-4 mt-20
        border-t border-white/10
        text-white
      "
    >
      <img src={assets.logo} width={150} alt="" className="opacity-90" />

      <p className="
        flex-1 pl-4
        text-sm text-white/60
        max-sm:hidden
        border-l border-white/10
      ">
        Copyright @Rohit | All Right Reserved
      </p>

      <div className="flex gap-3">
        <a
          href="#"
          className="
            inline-flex items-center justify-center
            h-9 w-9 rounded-full
            hover:opacity-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
            transition-opacity
          "
          aria-label="Facebook"
        >
          <img src={assets.facebook_icon} alt="" className="h-8 w-8" />
        </a>

        <a
          href="#"
          className="
            inline-flex items-center justify-center
            h-9 w-9 rounded-full
            hover:opacity-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
            transition-opacity
          "
          aria-label="Instagram"
        >
          <img src={assets.instagram_icon} alt="" className="h-8 w-8" />
        </a>

        <a
          href="#"
          className="
            inline-flex items-center justify-center
            h-9 w-9 rounded-full
            hover:opacity-90
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
            transition-opacity
          "
          aria-label="Twitter"
        >
          <img src={assets.twitter_icon} alt="" className="h-8 w-8" />
        </a>
      </div>
    </div>
  )
}

export default Footer
