import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const ucPackages = [
  { id: 1, amount: 60, price: 75, discount: null, popular: false },
  { id: 2, amount: 325, price: 380, discount: null, popular: false },
  { id: 3, amount: 660, price: 750, discount: '5%', popular: true },
  { id: 4, amount: 1800, price: 1990, discount: '10%', popular: false },
  { id: 5, amount: 3850, price: 3990, discount: '15%', popular: false },
  { id: 6, amount: 8100, price: 7990, discount: '20%', popular: false },
];

const reviews = [
  { id: 1, name: 'Алексей М.', rating: 5, text: 'Быстрая доставка UC, всё пришло за 5 минут! Рекомендую!' },
  { id: 2, name: 'Дмитрий К.', rating: 5, text: 'Лучшие цены на рынке, покупаю здесь постоянно' },
  { id: 3, name: 'Михаил П.', rating: 5, text: 'Отличный сервис, поддержка быстро помогла с вопросом' },
];

const paymentMethods = [
  { id: 1, name: 'Банковская карта', icon: 'CreditCard', desc: 'Visa, MasterCard, МИР' },
  { id: 2, name: 'СБП', icon: 'Smartphone', desc: 'Система быстрых платежей' },
  { id: 3, name: 'Электронные кошельки', icon: 'Wallet', desc: 'ЮMoney, Qiwi' },
  { id: 4, name: 'Криптовалюта', icon: 'Bitcoin', desc: 'BTC, ETH, USDT' },
];

const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold text-xl">
                UC
              </div>
              <span className="text-xl font-bold">PUBG SHOP</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('catalog')} className="hover:text-primary transition-colors">
                Каталог
              </button>
              <button onClick={() => scrollToSection('howto')} className="hover:text-primary transition-colors">
                Как получить
              </button>
              <button onClick={() => scrollToSection('reviews')} className="hover:text-primary transition-colors">
                Отзывы
              </button>
              <button onClick={() => scrollToSection('payment')} className="hover:text-primary transition-colors">
                Оплата
              </button>
              <button onClick={() => scrollToSection('contacts')} className="hover:text-primary transition-colors">
                Контакты
              </button>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Корзина
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/5f477774-a157-4e2f-8319-277cc6db8d03/files/2e7d3adb-9821-410f-b716-d27375ded18a.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-glow">
            ПОКУПАЙ UC
            <br />
            <span className="text-primary">ПОБЕЖДАЙ В PUBG</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Мгновенная доставка игровой валюты • Лучшие цены • 24/7 поддержка
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            onClick={() => scrollToSection('catalog')}
          >
            <Icon name="Zap" size={24} className="mr-2" />
            Выбрать пакет UC
          </Button>
        </div>
      </section>

      <section id="catalog" className="py-20 bg-gradient-pubg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Пакеты UC</h2>
            <p className="text-muted-foreground text-lg">
              Выберите нужное количество игровой валюты
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ucPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transition-all hover:scale-105 cursor-pointer ${
                  selectedPackage === pkg.id ? 'ring-2 ring-primary' : ''
                } ${pkg.popular ? 'border-primary border-2' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    ХИТ ПРОДАЖ
                  </Badge>
                )}
                {pkg.discount && (
                  <Badge className="absolute -top-3 right-4 bg-secondary text-secondary-foreground">
                    -{pkg.discount}
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="Coins" size={40} className="text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">{pkg.amount} UC</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary mt-2">
                    {pkg.price} ₽
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Icon name="ShoppingBag" size={20} className="mr-2" />
                    Купить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="howto" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Как получить UC</h2>
            <p className="text-muted-foreground text-lg">Простой процесс в 4 шага</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: 'MousePointerClick',
                title: 'Выберите пакет',
                desc: 'Выберите нужное количество UC из каталога',
              },
              {
                step: 2,
                icon: 'CreditCard',
                title: 'Оплатите',
                desc: 'Оплатите удобным способом',
              },
              {
                step: 3,
                icon: 'User',
                title: 'Укажите ID',
                desc: 'Укажите свой игровой ID PUBG',
              },
              {
                step: 4,
                icon: 'Zap',
                title: 'Получите UC',
                desc: 'UC придёт на аккаунт за 1-10 минут',
              },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <Icon name={item.icon as any} size={48} className="mx-auto mb-4 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <img
              src="https://cdn.poehali.dev/projects/5f477774-a157-4e2f-8319-277cc6db8d03/files/bc2f576c-7128-4655-bf78-b026cb46fb75.jpg"
              alt="Инструкция"
              className="max-w-2xl mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 bg-gradient-pubg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Отзывы покупателей</h2>
            <p className="text-muted-foreground text-lg">Что говорят наши клиенты</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-primary fill-primary" />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-base">{review.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="payment" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Способы оплаты</h2>
            <p className="text-muted-foreground text-lg">Выберите удобный способ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="text-center hover:border-primary transition-all">
                <CardHeader>
                  <Icon name={method.icon as any} size={48} className="mx-auto mb-4 text-primary" />
                  <CardTitle>{method.name}</CardTitle>
                  <CardDescription>{method.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-gradient-pubg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Контакты</h2>
            <p className="text-muted-foreground text-lg">Мы всегда на связи</p>
          </div>
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Icon name="MessageCircle" size={40} className="mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Telegram</CardTitle>
                <CardDescription>@pubg_uc_shop</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Icon name="Mail" size={40} className="mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Email</CardTitle>
                <CardDescription>support@pubguc.shop</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Icon name="Phone" size={40} className="mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">WhatsApp</CardTitle>
                <CardDescription>+7 (999) 123-45-67</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 PUBG UC SHOP. Все права защищены.</p>
          <p className="text-sm mt-2">
            Это неофициальный магазин. PUBG является торговой маркой KRAFTON, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;