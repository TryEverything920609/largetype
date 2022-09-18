import type { NextPage } from 'next'
import Head from 'next/head'
import { FC, useEffect, useRef, useState } from 'react'

const Home: NextPage = () => {
  const [text, setText] = useState('')
  const [showing, setShowing] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowing((x) => !x)
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      button.current!.click()
      textarea.current!.blur()
    }
  }
  useEffect(() => {
    if (!showing) {
      textarea.current!.focus()
    }
  }, [showing])
  return (
    <div>
      <Head>
        <title>Large Type</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form className="flex flex-col gap-3 p-4" onSubmit={onSubmit}>
        <textarea
          id="text-input"
          className="textarea textarea-bordered"
          placeholder="Text"
          rows={5}
          onKeyDown={onKeyDown}
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={textarea}
        ></textarea>
        <button ref={button} id="submit-button" className="btn">
          Show
        </button>
      </form>
      {showing ? (
        <TextDisplay text={text} onExit={() => setShowing(false)} />
      ) : null}
    </div>
  )
}

export default Home

interface TextDisplay {
  text: string
  onExit: () => void
}
const TextDisplay: FC<TextDisplay> = (props) => {
  const container = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  useEffect(() => {
    autofit(container.current!, content.current!)
  }, [props.text])
  useEffect(() => {
    const onResize = () => {
      autofit(container.current!, content.current!)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const { onExit } = props
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onExit])
  return (
    <div
      id="text-output"
      className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center text-center"
      ref={container}
    >
      <div ref={content}>
        <div className="p-[0.5em]">{props.text}</div>
      </div>
    </div>
  )
}

function autofit(container: HTMLDivElement, content: HTMLDivElement) {
  let min = 16
  let max = 1024
  for (let i = 0; i < 10; i++) {
    const size = (min + max) / 2
    content.style.fontSize = `${size}px`
    if (content.offsetHeight > container.offsetHeight) {
      max = size
    } else {
      min = size
    }
  }
}
