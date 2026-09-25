import { useState, useEffect } from 'react';

export interface SecretApologyConfig {
  secretCode: string;
  recipientName: string;
  senderName: string;
  title: string;
  letterContent: string;
  musicUrl: string;
  useBuiltinMelodyIfNoAudio: boolean;
  isSecretActive: boolean;
  isPlayingMusic: boolean;
  volume: number;
}

const STORAGE_KEY = 'krait_secret_apology_config_v3';

const AKANSHA_LETTER = `Why do I always ask for so much? Why do I sit around waiting for someone to care? Why do I even try to make friends? Why do I keep taking another breath every day?

Every time I make friends I start hoping, and when I hope I start falling and loving, and when I love I feel like I'm actually alive. But when I don't have that, I just stop existing. I'm not grown up enough to just sit and wait for the right time. My heart beats way too loud and it hurts my chest trying to find its own rhythm. I just want to pour out my whole ocean for you, but someone keeps trying so hard to dry it all up and leave me empty.

I had to learn the hardest way possible that the only way to survive this pain is to just accept that everything comes for a reason, and everything stays for a reason, and every single thing that hurts, hurts for a reason. Trying to hide from it or fight the pain won't fix what broke inside me. Akansha, whatever you put your mind on just grows and grows, and the pain just gets bigger.

There are these flowers growing deep down in my lungs, and I am only keeping them alive by watering them with all the tears you gave me. I wish I could just finally tell you what you really mean to me, because for you I would tear my chest open and pluck every single one of those flowers out of my lungs and my breaking heart just to hand you a bouquet of all the words I never got to say. I really miss you so much, sometimes it suffocates me.

Okay, I agree... ye jyada kar diya mene, ye kuch jyada ho gaya hai.

But I have this terrible fear deep inside—a weird feeling that my absence will just erase me completely. I feel like me not being there just makes everyone realize how much space I was taking up and how much of a burden I was. I feel like people will actually start loving the quiet when I'm gone and they might even wish I was never there to begin with. I just feel so easily replaceable, like anyone slightly more interesting could just take my spot and no one would even notice I'm missing.

Akansha, I'm really not stupid at all. Maybe I'm just an average guy trying so hard to just be a little better. But I know whatever is happening to me or whatever I end up doing, I'm completely aware of all of it before I even take a step. I overthink it at least ten different times and almost every time I already know exactly how it will end. Very rarely does something slip past me or surprise me anymore.

I don't even want your advice and I don't want you to defend yourself, because I already know what I want. I hate when someone compares me to someone else, but I keep destroying my own mind by comparing myself to everyone else. I know it's completely useless, but maybe I just need to suffer through the process of feeling it all. But you... you just give up on me every single time it gets hard. Right when it is time to console me and be there, you just walk away and give up. Maybe I just desperately needed you to talk to me in that soft way, because I already know the final result. I already know how everything falls apart. Staring at this, I don't even know if you get my point at all. What I'm saying is... I know ki aisa nahi hai. Maybe main ab sach mein bata bhi nahi pa raha jo main soch raha. Tujhe nahi pata, but 'maybe' ke baad 15 minute ka pause tha yahan ki kaise format karun.

"Beggars can't be choosers"—I don't want to be a beggar. I am strong enough.
And still you ask why I keep talking to you even when I am hurt. You can think of it as a road that has two directions: on the right side you are there, but on the left side other people are there who want to talk to me. But when I go left, nothing feels right to me. And when I go to you, when I go right, nothing is left in me.

Maybe you'll never read this one either. I really don't think you will ever understand what it actually means to me that you even exist. Out of everyone in this world I could have bumped into, I somehow found you, and you just became this heavy thing I carry inside my chest even when you are nowhere around. I'm so grateful for every word we said, every laugh that hurt my stomach, and every dumb little moment that meant nothing at the time but somehow stayed stuck in my bleeding head. I'm grateful you made me feel understood when I couldn't even explain myself, and for staying when I was so hard to deal with, and for trusting me with those tiny fragile pieces of yourself.

There are things about you that you don't even notice, like the way you sound when you are excited, and your little habits that make a completely numb day feel real. I memorize all of it because I care about you way more than I know how to say. And if you ever sit alone wondering if you actually mattered to me, I just hope you remember: you didn't just walk past me. You left pieces of yourself in spaces inside me I didn't even know could hold memories. You completely ruined how certain songs feel now, and how places look, and how moments just haunt my head.

Maybe someday life is going to drag us in completely different directions and everything will break, but I will still be crying over the fact that for at least one tiny part of my life... if I had one wish, I would just give you my eyes for a single second so you could finally see yourself the way I do. Maybe then you would understand why losing you hurts so incredibly bad. Why just knowing you meant everything to me, and why no matter how much time passes, a broken part of me will always be grateful that the cruel universe somehow threw you into my path.

I really want you to teach me how to be, how to exist by letting all the bittersweet, painful, tragic wreckage go and let in the joy of being.

I don't know why I love being sad.
And try as hard as you can, you will always be my friend.
I just wish that death felt like you to me.

You are not average at all.`;

const DEFAULT_CONFIG: SecretApologyConfig = {
  secretCode: 'gogu sorry',
  recipientName: 'Akansha',
  senderName: 'Forever Here',
  title: 'All The Words I Never Got To Say 🌸',
  letterContent: AKANSHA_LETTER,
  musicUrl: '/desposition.mp3',
  useBuiltinMelodyIfNoAudio: true,
  isSecretActive: false,
  isPlayingMusic: false,
  volume: 0.75,
};

class SecretApologyStore {
  private config: SecretApologyConfig;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): SecretApologyConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(raw), isSecretActive: false, isPlayingMusic: false };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  }

  private saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // ignore
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getState(): SecretApologyConfig {
    return this.config;
  }

  public updateConfig(updates: Partial<SecretApologyConfig>) {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public triggerSecret(playMusic = true) {
    this.config.isSecretActive = true;
    if (playMusic) {
      this.config.isPlayingMusic = true;
    }
    this.notify();
  }

  public stopSecret() {
    this.config.isSecretActive = false;
    this.config.isPlayingMusic = false;
    this.notify();
  }

  public toggleMusic(play?: boolean) {
    this.config.isPlayingMusic = play !== undefined ? play : !this.config.isPlayingMusic;
    this.notify();
  }

  public setVolume(vol: number) {
    this.config.volume = Math.max(0, Math.min(1, vol));
    this.saveConfig();
  }

  public matchesSecretCode(input: string): boolean {
    if (!input) return false;
    const clean = input.toLowerCase().trim().replace(/\s+/g, ' ');
    const target = (this.config.secretCode || 'gogu sorry').toLowerCase().trim().replace(/\s+/g, ' ');

    return (
      clean === target ||
      clean.includes(target) ||
      clean === 'gogu sorry' ||
      clean.includes('gogu sorry') ||
      clean === 'gogusorry' ||
      clean.includes('gogusorry')
    );
  }
}

export const secretApologyStore = new SecretApologyStore();

export function useSecretApology(): SecretApologyConfig {
  const [config, setConfig] = useState(secretApologyStore.getState());

  useEffect(() => {
    return secretApologyStore.subscribe(() => {
      setConfig({ ...secretApologyStore.getState() });
    });
  }, []);

  return config;
}
