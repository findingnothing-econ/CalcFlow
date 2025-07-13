# 🚀 Step 3: Deploy Django to EC2 (Development Mode)

This guide will help you launch your Django project on an AWS EC2 instance using the development server. Later, we’ll set it up for production with Gunicorn and Nginx.


## ✅ Prerequisites

- AWS account
- Django project pushed to GitHub (from Step 2)
- Local SSH key (`your-key.pem`) ready


## 🖥️ 1. Launch EC2 Instance (Ubuntu)

1. Go to: [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Launch Instance**
3. Settings:
   - **Name**: `django-dev`
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance type**: `t2.micro` (free tier)
   - **Key pair**: Create a New Key Pair: name it `my-django-key`, choose `RSA`, then choose `.pem` file for Mac/Linux and choose `.ppk` file for Windows with PuTTY. Download the file somewhere you can find. We will need it later.
   - **Storage**: 8 GB
4. **Security Group Rules**:
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow Custom TCP port 8000 (for Django dev server)
5. Click **Launch**

Some explations are given below:

1. An AMI (Amazon Machine Image) is a "template" for your cloud computer, which includes an operating system (OS) + basic software that you use to launch your EC2 instance.
2. We choose Ubuntu 22.04 LTS because it is compatible for most of our purpose, it is lightweight, it is popular, and it is stability - "LST" means long term support.
3. An instance type defines the hardware configuration (CPU, memory, networking power, etc.) of your EC2 virtual machine. `t2.micro` is perfect for small project.
4. The key pair is used for you to log in to your EC2 instance. The file you download, the private key, is the key. EC2 will match it with the public key on EC2 instance, which is like a lock.
5. Security group is like a virtual firewall, which controls what types of network traffic from the internet are allowed to reach your server. Here, we allow SSH (port 20, which is allowing you to login from the terminal), HTTP (port 80, other people can access), and Custom TCP with port 8000 to allow Django dev server. Here, `0.0.0.0/0` means everyone on the internet can access.

## 🔑 2. SSH Into EC2 Instance

From your local terminal:

```bash
chmod 400 my-django-key.pem
ssh -i my-django-key.pem ubuntu@YOUR.EC2.IP.ADDRESS
```

The first line makes the `.pem` file can only be read by you. This is necessary since EC2 will refuse a `.pem` file if it's too open.

The second line connect to your EC2 instance via SSH. Here, `YOUR.EC2.IP.ADDRESS` should be the public IPv4 address of the EC2 instance.

You will be asked "Are you sure you want to continue connecting (yes/no/[fingerprint])?" Say "yes".

After doing this, you are controling the EC2 instance, a computer far away from you, from your terminal.



## 🧰 3. Install Required Packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv git -y
```

The first line updates and upgrade the system's package. The second line install Python3 pip, virtual enviroment and git.


## 📦 4. Clone Your Django Project from GitHub

```bash
git clone https://github.com/YOUR_USERNAME/welcome_project.git
cd welcome_project
```

--
The steps above are done in EC2. The steps below should be done locally.
--


## 📦 5. Create `requirements.txt` Locally (on your Mac)

From your **local development environment**, run:

```bash
touch requirements.txt
```

You can see the `requirements.txt` file. Open it, and write

```
Django==5.0.6
asgiref==3.7.2
sqlparse==0.4.4
```

It will be used to tell EC2 what versions of packages to be used.


## ⚙️ 6. Configure Django for EC2 Access

Edit `config/settings.py`:

```python
ALLOWED_HOSTS = ['YOUR.EC2.IP.ADDRESS']
```

Here, we use the EC2 instance's Public IPv4 address. 

Notice that every time you stop your EC2 instance, this address will change. You should update it if you have stopped your EC2 instance.

This tells Django to only respond to requests from these IP addresses.


## ▶️ 7. Push Change to GitHub

`Make changes → commit → push:

```bash
git add .
git commit -m "Add requirements.txt and configure Django for EC2 access."
git push origin main
```

--
The steps above are done locally. The steps below should be done in EC2.
--

## 🔁 8. Pull in EC2

SSH into your instance and update:

```bash
ssh -i your-key.pem ubuntu@YOUR.EC2.IP.ADDRESS
cd welcome_project
git pull origin main
python3 -m venv env
source env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

Here, we use `git pull origin main` to get the updated project from GitHub. Then we set the virtual environment and download packages described in the `requirements.txt`.

## ▶️ 9. Run Django Development Server

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Now open your browser and visit:

```
http://YOUR.EC2.IP.ADDRESS:8000
```

You should see your **Welcome page** 🎉


## ✅ Next Step

Set up:
- Gunicorn (Step 4)
- Nginx (Step 5)
- HTTPS with Let’s Encrypt (Step 6, optional)

Let me know when you're ready!
