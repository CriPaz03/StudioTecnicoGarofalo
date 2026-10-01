"use client";
import {useEffect, useRef, useState} from "react";
import {navigation} from "@/lib/site";
import {MoveUpRight} from "lucide-react";

export function Brand({ href = "#" }: { href?: string }) {
    return (
        <a
            className="brand"
            href={href}
            aria-label="Studio Tecnico Garofalo, inizio pagina"
        >
            <svg viewBox="0 0 44 44" aria-hidden="true">
                <path d="M33 10H10v24h23V21H22M4 4h12M4 4v12M40 40H28M40 40V28"/>
            </svg>
            <span>
        STUDIO TECNICO<strong>GAROFALO</strong>
      </span>
        </a>
    );
}

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const menu = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 40);
        update();
        window.addEventListener("scroll", update, {passive: true});
        return () => window.removeEventListener("scroll", update);
    }, []);
    useEffect(() => {
        if (!open) return;
        const old = document.body.style.overflow;
        const button = trigger.current;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = old;
            button?.focus({preventScroll: true});
        };
    }, [open]);
    const close = () => {
        menu.current?.close();
        setOpen(false);
    };
    return (
        <>
            <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
                <Brand/>
                <nav aria-label="Navigazione principale">
                    {navigation.map(([label, href]) => (
                        <a key={href} href={href}>
                            {label}
                        </a>
                    ))}
                </nav>
                <a className="header-cta" href="#contatti">
                    Parliamo del tuo progetto <span aria-hidden="true"><MoveUpRight/></span>
                </a>
                <button
                    ref={trigger}
                    className="menu-trigger"
                    onClick={() => {
                        menu.current?.showModal();
                        setOpen(true);
                    }}
                    aria-label="Apri menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                >
                    <span/>
                    <span/>
                </button>
            </header>
            <dialog
                id="mobile-menu"
                ref={menu}
                className="mobile-menu"
                onCancel={close}
                onClose={() => setOpen(false)}
            >
                <button className="menu-close" onClick={close} aria-label="Chiudi menu">
                    ✕
                </button>
                <p className="eyebrow">STUDIO TECNICO GAROFALO</p>
                <nav aria-label="Navigazione mobile">
                    {navigation.map(([label, href], i) => (
                        <a key={href} href={href} onClick={close}>
                            <small>0{i + 1}</small>
                            {label}
                            <span><MoveUpRight/></span>
                        </a>
                    ))}
                </nav>
                <a className="button" href="#contatti" onClick={close}>
                    Parliamo del tuo progetto <span><MoveUpRight/></span>
                </a>
            </dialog>
            <a className="mobile-cta" href="#contatti">
                Parliamo del tuo progetto <span aria-hidden="true"><MoveUpRight/></span>
            </a>
        </>
    );
}
