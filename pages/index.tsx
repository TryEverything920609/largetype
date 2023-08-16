import clsx from 'clsx'
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
  const [showControls, setShowControls] = useState(false)
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
      onClick={() => setShowControls((x) => !x)}
      ref={container}
    >
      <div ref={content}>
        <div className="p-[0.5em] leading-[1.125em] tracking-[0.01em] font-semibold">
          {props.text}
        </div>
      </div>
      <div
        className={clsx(
          'absolute top-4 right-4',
          showControls ? '' : 'opacity-0 pointer-events-none',
        )}
      >
        <button className="btn btn-circle btn-outline" onClick={onExit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
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
    if (
      content.offsetHeight > container.offsetHeight ||
      content.offsetWidth > container.offsetWidth
    ) {
      max = size
    } else {
      min = size
    }
  }
}
