import { Instagram } from 'lucide-react';
import LazyImage from './LazyImage';

const InstagramFeed = () => {
    // Placeholder data - in a real app, this would come from Instagram Basic Display API
    // or a service like Behold.so, but for now we'll use a static grid for reliability
    const posts = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
            link: 'https://instagram.com',
            caption: 'თანამედროვე სამზარეულო შავი გრანიტის ზედაპირით. 🖤 #eliteworks #granite #kitchen'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=600&auto=format&fit=crop',
            link: 'https://instagram.com',
            caption: 'მარმარილოს აბაზანა - კლასიკური და დახვეწილი. ✨ #marble #bathroom #design'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop',
            link: 'https://instagram.com',
            caption: 'ახალი პროექტი: ბუხრის მოპირკეთება ბუნებრივი ქვით. 🔥 #fireplace #stone #interior'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=600&auto=format&fit=crop',
            link: 'https://instagram.com',
            caption: 'ავეჯი და ქვა - იდეალური სინთეზი. 🪑 #furniture #craftsmanship'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600&auto=format&fit=crop',
            link: 'https://instagram.com',
            caption: 'დეტალები ქმნიან სრულყოფილებას. 💎 #details #quality #eliteworks'
        },
        {
            id: 6,
            image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=600&auto=format&fit=crop',
            link: 'https://instagram.com',
            caption: 'გვესტუმრეთ შოურუმში და აარჩიეთ თქვენი ქვა. 📍 #showroom #tbilisi'
        }
    ];

    return (
        <section className="py-16 bg-surface">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center text-center mb-10">
                    <div className="bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-0.5 rounded-full mb-4">
                        <div className="bg-surface p-2 rounded-full">
                            <Instagram size={24} className="text-foreground" />
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">გამოგვყევით ინსტაგრამზე</h2>
                    <p className="text-muted-foreground">@eliteworks_georgia</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                    {posts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative aspect-square overflow-hidden bg-muted block"
                        >
                            <LazyImage
                                src={post.image}
                                alt={post.caption}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                <Instagram className="text-white" size={24} />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-accent-foreground font-semibold shadow-gold hover:scale-105 transition-transform"
                    >
                        <Instagram size={18} /> გამოგვყევით
                    </a>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
