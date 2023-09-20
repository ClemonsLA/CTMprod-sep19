# Instructions

## How to run website

To run project you need to install node.js -> https://nodejs.dev/en/download/

### Enter the project folder

`cd path_to_project/project_name`

### Download all dependencies

`npm install`

### Build the app

`npm run build`

### When ready -> post it on your server using command

`npm start`

## How to add content to Footer

In project folder navigate: `components/Footer/Footer.tsx`

There you can find all informations present in Footer (the bottom of the website)

If you don't want to show a social link, just leave it empty (""). The icon will disappear from website

[![img](https://i.postimg.cc/qvCpSWRB/Zrzut-ekranu-2023-07-14-141246.png)](https://i.postimg.cc/52FnzSPk/Zrzut-ekranu-2023-07-14-141729.png)

## How to modify content from About/Help

In project folder navigate: `pages/about/index.tsx` or `pages/help/index.tsx`

Modify content inside `<p>`

![img](https://i.postimg.cc/vm5wpm13/Zrzut-ekranu-2023-07-14-141729.png)

## How to modify Privacy Policy and Terms of Usage

In project folder navigate: `pages/privacy-policy/index.tsx` or `pages/terms-of-usage/index.tsx`

And to the same as above, change content of \<p\> elements

## How to change address of server 

In project folder navigate: `.env.local` file

change the line `API_URL=your_address_here` to your server's address
