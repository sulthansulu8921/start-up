import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Target, Users, Award, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To bridge the gap between talented developers and innovative clients, creating meaningful connections that drive digital transformation.",
    },
    {
      icon: Users,
      title: "Who We Are",
      description: "A passionate team of tech enthusiasts dedicated to fostering collaboration and empowering both developers and businesses to achieve their goals.",
    },
    {
      icon: Award,
      title: "Quality First",
      description: "We ensure every developer on our platform is skilled and professional, guaranteeing high-quality work for every project.",
    },
    {
      icon: Heart,
      title: "Our Vision",
      description: "To become the world's most trusted freelance platform, where innovation meets opportunity and great ideas become reality.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 gradient-hero">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6 animate-slide-up">
              About DevConnect
            </h1>
            <p className="text-xl text-white/90 animate-slide-up">
              Connecting skilled developers with innovative clients to build the future of technology
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                DevConnect was born from a simple observation: talented developers and innovative
                businesses often struggle to find each other. In a world where digital transformation
                is crucial, we saw an opportunity to create a platform that makes these connections
                effortless and meaningful.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                We believe that every great project starts with the right partnership. That's why
                we've built a platform that focuses on quality, transparency, and trust. Our rigorous
                vetting process ensures that clients get access to top-tier talent, while our fair
                pricing and secure payment system give developers the peace of mind they deserve.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, DevConnect serves thousands of developers and clients worldwide, facilitating
                projects that range from simple websites to complex enterprise applications. We're
                not just a platform—we're a community of innovators, creators, and problem-solvers
                working together to shape the digital landscape.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="shadow-medium animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose DevConnect?</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-primary">For Clients</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Access to a curated network of verified, skilled developers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Secure payment system with milestone-based payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Dedicated support throughout your project journey</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">For Developers</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span>Consistent flow of high-quality projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span>Fair compensation and timely payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span>Build your portfolio with diverse, challenging work</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span>Join a community of like-minded professionals</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 gradient-hero">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join DevConnect?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Whether you're looking to hire top talent or find your next great project,
              we're here to help you succeed.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;