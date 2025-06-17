
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  qr_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_chinese TEXT NOT NULL,
  title_malay TEXT NOT NULL,
  title_tamil TEXT NOT NULL,
  description TEXT NOT NULL,
  description_chinese TEXT NOT NULL,
  description_malay TEXT NOT NULL,
  description_tamil TEXT NOT NULL,
  location TEXT NOT NULL,
  location_chinese TEXT NOT NULL,
  location_malay TEXT NOT NULL,
  location_tamil TEXT NOT NULL,
  activity_date DATE NOT NULL,
  activity_time TIME NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 30,
  max_attendees INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create friendships table
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  friend_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Create activity participations table
CREATE TABLE public.activity_participations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  activity_id UUID REFERENCES public.activities(id) NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_id)
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_chinese TEXT NOT NULL,
  title_malay TEXT NOT NULL,
  title_tamil TEXT NOT NULL,
  description TEXT NOT NULL,
  description_chinese TEXT NOT NULL,
  description_malay TEXT NOT NULL,
  description_tamil TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reward redemptions table
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) NOT NULL,
  points_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for friendships
CREATE POLICY "Users can view their friendships" ON public.friendships FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
  friend_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create friendships" ON public.friendships FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their friendships" ON public.friendships FOR UPDATE USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
  friend_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- RLS Policies for activities
CREATE POLICY "Everyone can view activities" ON public.activities FOR SELECT USING (true);

-- RLS Policies for activity participations
CREATE POLICY "Users can view all participations" ON public.activity_participations FOR SELECT USING (true);
CREATE POLICY "Users can create their participations" ON public.activity_participations FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- RLS Policies for rewards
CREATE POLICY "Everyone can view available rewards" ON public.rewards FOR SELECT USING (is_available = true);

-- RLS Policies for reward redemptions
CREATE POLICY "Users can view their redemptions" ON public.reward_redemptions FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create their redemptions" ON public.reward_redemptions FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Insert sample activities for 2025 June onwards
INSERT INTO public.activities (title, title_chinese, title_malay, title_tamil, description, description_chinese, description_malay, description_tamil, location, location_chinese, location_malay, location_tamil, activity_date, activity_time, points_reward) VALUES
('Morning Tai Chi at Block 273', '太极晨练 - 273座', 'Tai Chi Pagi di Blok 273', 'தை சி காலை பயிற்சி - 273 தொகுதி', 'Join our friendly group for morning tai chi exercises. Perfect for beginners!', '加入我们友好的太极晨练小组。非常适合初学者！', 'Sertai kumpulan mesra kami untuk latihan tai chi pagi. Sesuai untuk pemula!', 'எங்கள் நட்பான குழுவில் சேர்ந்து காலை தை சி பயிற்சிகளில் கலந்துகொள்ளுங்கள். தொடக்கநிலையாளர்களுக்கு ஏற்றது!', 'Block 273 Void Deck', '273座组屋底层', 'Dek Kosong Blok 273', '273 தொகுதி வெற்று மேடை', '2025-06-15', '07:00', 50),
('Bird Watching at Keat Hong Park', '观鸟活动 - 吉丰公园', 'Pemerhatian Burung di Taman Keat Hong', 'பறவை பார்வையிடல் - கீட் ஹாங் பூங்கா', 'Early morning bird watching session. Bring your own binoculars or borrow ours!', '清晨观鸟活动。可自带望远镜或借用我们的！', 'Sesi pemerhatian burung awal pagi. Bawa teropong sendiri atau pinjam milik kami!', 'சிறு காலை பறவை பார்வையிடல் அமர்வு. உங்கள் சொந்த தொலைநோக்கியைக் கொண்டு வாருங்கள் அல்லது எங்களிடமிருந்து கடன் வாங்குங்கள்!', 'Keat Hong Park', '吉丰公园', 'Taman Keat Hong', 'கீட் ஹாங் பூங்கா', '2025-06-18', '06:30', 40),
('World Cup Viewing Party', '世界杯观赛聚会', 'Parti Menonton Piala Dunia', 'உலகக் கோப்பை பார்வையிடல் விழா', 'Watch the big match together! Free kopi and snacks provided.', '一起观看重要比赛！免费提供咖啡和小食。', 'Tonton perlawanan besar bersama-sama! Kopi dan snek percuma disediakan.', 'பெரிய போட்டியை ஒன்றாகப் பாருங்கள்! இலவச காபி மற்றும் சிற்றுண்டிகள் வழங்கப்படும்.', 'Keat Hong Community Club', '吉丰民众俱乐部', 'Kelab Komuniti Keat Hong', 'கீட் ஹாங் சமுதாய மன்றம்', '2025-06-22', '20:00', 35),
('Qing Gong Exercise Class', '气功练习班', 'Kelas Latihan Qing Gong', 'கிங் காங் உடற்பயிற்சி வகுப்பு', 'Traditional qing gong exercises for health and vitality. All levels welcome.', '传统气功练习，促进健康活力。欢迎各个水平的朋友。', 'Latihan qing gong tradisional untuk kesihatan dan vitaliti. Semua peringkat dialu-alukan.', 'ஆரோக்கியம் மற்றும் உயிர்ச்சக்திக்கான பாரம்பரிய கிங் காங் பயிற்சிகள். அனைத்து நிலைகளும் வரவேற்கப்படுகின்றன.', 'Block 268 Void Deck', '268座组屋底层', 'Dek Kosong Blok 268', '268 தொகுதி வெற்று மேடை', '2025-06-25', '08:00', 45),
('Community Cooking Workshop', '社区烹饪工作坊', 'Workshop Memasak Komuniti', 'சமுதாய சமையல் பட்டறை', 'Learn to cook traditional dishes together. Ingredients provided!', '一起学习烹饪传统菜肴。提供食材！', 'Belajar memasak hidangan tradisional bersama-sama. Bahan-bahan disediakan!', 'பாரம்பரிய உணவுகளை ஒன்றாக சமைக்கக் கற்றுக்கொள்ளுங்கள். பொருட்கள் வழங்கப்படுகின்றன!', 'Block 270 Multi-Purpose Hall', '270座多用途厅', 'Dewan Serbaguna Blok 270', '270 தொகுதி பல்நோக்கு மண்டபம்', '2025-07-02', '14:00', 60);

-- Insert sample rewards
INSERT INTO public.rewards (title, title_chinese, title_malay, title_tamil, description, description_chinese, description_malay, description_tamil, points_cost) VALUES
('$5 NTUC Voucher', '$5 职总平价合作社券', 'Baucar NTUC $5', '$5 NTUC வவுச்சர்', 'Redeem for $5 off your next NTUC shopping', '下次在职总平价合作社购物可减$5', 'Tebus untuk diskaun $5 untuk belanja NTUC seterusnya', 'உங்கள் அடுத்த NTUC கொள்முதலில் $5 தள்ளுபடி', 100),
('$10 Food Court Voucher', '$10 食阁券', 'Baucar Food Court $10', '$10 உணவு நீதிமன்ற வவுச்சர்', 'Enjoy a meal at any participating food court', '在任何参与的食阁享用餐食', 'Nikmati hidangan di mana-mana food court yang mengambil bahagian', 'பங்கேற்கும் எந்த உணவு நீதிமன்றத்திலும் உணவை அனுபவிக்கவும்', 200),
('Free Movie Ticket', '免费电影票', 'Tiket Wayang Percuma', 'இலவச திரைப்பட டிக்கெட்', 'Watch any movie at participating cinemas', '在参与的电影院观看任何电影', 'Tonton apa-apa filem di pawagam yang mengambil bahagian', 'பங்கேற்கும் திரையரங்குகளில் எந்த படத்தையும் பார்க்கவும்', 300),
('Community Center Class Pass', '民众俱乐部课程通行证', 'Pas Kelas Pusat Komuniti', 'சமுதாய மைய வகுப்பு பாஸ்', 'Free access to any community center class for 1 month', '免费参加民众俱乐部任何课程1个月', 'Akses percuma ke mana-mana kelas pusat komuniti selama 1 bulan', '1 மாதத்திற்கு எந்த சமுதாய மைய வகுப்பிற்கும் இலவச அணுகல்', 500);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, phone_number, qr_code)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', 'User_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data ->> 'phone_number', ''),
    'QR-' || upper(substr(replace(new.id::text, '-', ''), 1, 8))
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
