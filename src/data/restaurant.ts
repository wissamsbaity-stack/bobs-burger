export const restaurantInfo = {
  name: "Bob's Burger",
  legalName: "BOB'S BURGER & MORE S.A.R.L",
  tagline: "Craft burgers & more — delivered across Lebanon",
  phone: "70/012 935",
  phoneSecondary: "05/807 432",
  email: "ahmad.kob.1@gmail.com",
  whatsapp: "96170583901",
  address: {
    street: "Near Zarifa Cafe",
    city: "Aramoun",
    state: "Lebanon",
    country: "Lebanon",
  },
  coordinates: { lat: 33.790275857563, lng: 35.48766374588 },
  hours: [{ days: "Daily", time: "Check Instagram for hours" }],
  social: {
    instagram: "https://www.instagram.com/bobburger.lb",
    facebook: "https://www.facebook.com/bobs burger & more sarl",
  },
  branding: {
    logo: "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/2.jpg",
    cover: "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/cover8_2.jpg",
    heroBurger:
      "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/SalesItems/ysf03919_2.png",
  },
} as const;
