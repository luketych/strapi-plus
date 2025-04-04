For a new Ubuntu 22 LTS server running on Digital Ocean.

This is apparently easier when developing between M1 machine and linux, and easier with strapi. 
More support.



```@ChatGPT:

🧱 1. Docker Image Compatibility (ARM64 vs x86_64)
	•	Ubuntu (and Alpine) base images often come with multi-arch support, including:
	•	arm64 for your MacBook M1
	•	amd64 for your Ubuntu server
	•	CentOS images often lack ARM64 builds or are incomplete/buggy on ARM-based machines like M1



📦 2. Package Availability & Build Toolchain
	•	Ubuntu (and Debian-based systems) have more recent and readily available packages needed for building Strapi and things like sharp, node-gyp, vips, etc.
	•	CentOS 8 uses older libraries and compilers, which can break or slow down:
	•	Native module builds (like sharp, bcrypt)
	•	Node.js and NPM compatibility
	•	Alpine-style optimizations (musl vs glibc)

<!-- @Luke:

This makes sense because I was having issues with these packages: sharp, bcrypt, if I recall correctly.

-->


🧪 3. Ubuntu Is the Default Target for Most Docker Images

Most official Docker images (including node, strapi/strapi, nginx, postgres) are:
	•	Built and tested primarily on Ubuntu and Debian
	•	Expect Ubuntu-like paths and libraries
	•	Rarely tested against CentOS or RHEL unless explicitly designed for enterprise use


⚡ 4. Cross-Build Simplicity with Ubuntu

If you’re doing multi-platform Docker builds (M1 dev → x86 server), the following work better:
	•	🟢 ubuntu, debian, alpine
	•	🔴 CentOS often needs extra flags or the qemu-user-static emulator layer for arm64 → x86 builds


👩‍💻 5. Community and Documentation Bias

Strapi, Node.js, Docker, and modern frontend/backend stacks:
	•	Have better community support, examples, and CI pipelines on Ubuntu
	•	Rarely test against CentOS by default
	•	Use apt, which is cleaner for scripting than CentOS’s yum/dnf for many devs
end @chatGPT```
