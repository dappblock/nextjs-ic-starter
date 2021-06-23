/* eslint-disable @next/next/no-img-element */
// Next, React
import Head from 'next/head'
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css'

// Dfinity
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as hello_idl, canisterId as hello_id } from 'dfx-generated/hello';

const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST });
const hello = Actor.createActor(hello_idl, { agent, canisterId: hello_id });
const isLocalIC = process.env.NEXT_PUBLIC_IS_LOCAL_IC == 'true' || false;

function HomePage() {
    const [name, setName] = useState('');
    const [greetingMessage, setGreetingMessage] = useState('');

    const onLoadCount = 1;
    useEffect(() => {
        async function onLoad() {
            await agent.fetchRootKey();
            console.info(`Agent fetched root key`);
        }

        onLoad();
    }, [onLoadCount]);

    function onChangeName(e) {
        const newName = e.target.value;
        setName(newName);
    }

    async function sayGreeting() {
        const greeting = await hello.greet(name);
        setGreetingMessage(greeting);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Internet Computer</title>
            </Head>
            <main className={styles.main}>
                <h3 className={styles.title}>
                    Welcome to Next.js Internet Computer Starter Template!
                </h3>

                <img src="/logo.png" alt="DFINITY logo" className={styles.logo} />

                <section>
                    <label htmlFor="name">Enter your name: &nbsp;</label>
                    <input id="name" alt="Name" type="text" value={name} onChange={onChangeName} />
                    <button onClick={sayGreeting}>Send</button>
                </section>
                <section>
                    <label>Response: &nbsp;</label>
                    {greetingMessage}
                </section>
            </main>
        </div>
    )
}

export default HomePage