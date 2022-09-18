import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Large Type</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col gap-3 p-4">
        <textarea
          className="textarea textarea-bordered"
          placeholder="Text"
          rows={5}
        ></textarea>
        <button className="btn">Show</button>
      </div>
    </div>
  )
}

export default Home
