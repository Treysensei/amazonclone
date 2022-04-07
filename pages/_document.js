import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

export default class MyDoument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;500;700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDoument.getInitialProps = async (ctx) => {
  const origionalRenderPage = ctx.renderPage;
  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    origionalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App) => (props) => <App emototionCache={cache} {...props} />,
    });
  const intitialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(intitialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));
  return {
    ...intitialProps,
    styles: [
      ...React.Children.toArray(intitialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
