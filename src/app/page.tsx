'use client';

import Image from 'next/image';
import styles from './page.module.scss';
import React, { useState, useEffect } from 'react';

const Main = () => {
    // State untuk enkripsi & dekripsi
    const [key, setKey] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');
    const [bitLength, setBitLength] = useState(4);

    // Inisialisasi S-Box
    const initSBox = (key: any) => {
        let sBox = [];
        for (let i = 0; i < bitLength; i++) {
            sBox[i] = i;
        }

        let j = 0;
        for (let i = 0; i < bitLength; i++) {
            j =
                (j + sBox[i] + parseInt(key.charCodeAt(i % bitLength))) %
                bitLength;
            // Swap nilai sBox[i] dengana sBox[j]
            let temp: any = sBox[i];
            sBox[i] = sBox[j];
            sBox[j] = temp;
        }

        return sBox;
    };

    // Generate keystream
    const genKeyStream = (plaintext: any, sBox: any) => {
        let keyStream = '';
        let i = 0;
        let j = 0;
        for (let k = 0; k < plaintext.length; k++) {
            i = (i + 1) % bitLength;
            j = (j + sBox[i]) % bitLength;

            // Swap nilai
            let temp: any = sBox[i];
            sBox[i] = sBox[j];
            sBox[j] = temp;

            let key = sBox[(sBox[i] + sBox[j]) % bitLength];
            keyStream += String.fromCharCode(key);
        }

        return keyStream;
    };

    // Func untuk mengenkripsi plaintext
    const encrypt = (plaintext: any, key: any) => {
        let sBox = initSBox(key);
        let keyStream = genKeyStream(plaintext, sBox);

        let ciphertext = '';
        for (let i = 0; i < plaintext.length; i++) {
            // XOR plaintext dengan keystream

            let encryptedChar =
                plaintext.charCodeAt(i) ^ keyStream.charCodeAt(i);

            ciphertext += String.fromCharCode(encryptedChar);
        }

        return ciphertext;
    };

    const handleEncrypt = () => {
        // Enkripsi plaintext menggunakan kunci yang diberikan
        const encryptedText = encrypt(inputValue, key);
        setOutputValue(encryptedText);
    };

    // State untuk menyimpan teks yang akan diubah secara berkala
    const [changingText, setChangingText] = useState('');

    // Untuk memperbarui teks secara berkala
    useEffect(() => {
        // Func untuk memperbarui teks
        const updateText = () => {
            setOutputValue(`${encrypt(inputValue, key)}`);
        };
        const upKey = () => {
            setKey(`${key.slice(0, bitLength)}`);
        };
        const updateDate = () => {
            setChangingText(`${new Date().toLocaleTimeString()}`);
        };

        // Jalankan fungsi updateText setiap 10 ms
        const intervalId = setInterval(updateText, 10);
        const intervalDate = setInterval(updateDate, 5);
        upKey();

        // Membersihkan interval ketika komponen tidak lagi digunakan
        return () => {
            clearInterval(intervalId);
            clearInterval(intervalDate);
        };
    }, [inputValue, key, bitLength]);

    const bitHandleChange = (e: any) => {
        let value = parseInt(e.target.value);
        if (value > 255) {
            value = 255;
        }
        if (value < 1) {
            value = 1;
        }
        setBitLength(value);
    };

    return (
        <main className={styles.mainContainer}>
            <h1 className={styles.titleBox}>Enkriptor & Dekriptor RC4</h1>

            <div className={styles.subContainer}>
                <div className={styles.Box}>
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Input"
                    ></textarea>
                </div>

                <div className={styles.Box}>
                    <div>
                        <label htmlFor="key">
                            Key{' '}
                            <span className={styles.miniText}>
                                (Panjang key = bits)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={key}
                            id="key"
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Input Key"
                            maxLength={bitLength}
                        />
                    </div>

                    <div>
                        <label htmlFor="bit">
                            Jumlah Bit{' '}
                            <span className={styles.miniText}>(Maks: 255)</span>
                        </label>
                        <input
                            type="number"
                            id="bit"
                            value={bitLength}
                            onChange={bitHandleChange}
                            placeholder="Input bit"
                            maxLength={4}
                            min={1}
                            max={256}
                        />
                    </div>
                </div>
                <div className={styles.Box}>
                    <textarea
                        value={outputValue}
                        onChange={(e) => setOutputValue(e.target.value)}
                        readOnly
                        placeholder="Output"
                    ></textarea>
                </div>
            </div>
            <div className={styles.footerBox}>
                <h3>{changingText}</h3>
                <h3>&copy; Delvan Ramadhan | 2024</h3>
            </div>
        </main>
    );
};

export default Main;
