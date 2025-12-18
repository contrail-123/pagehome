/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                       轨迹秘境结社 - 主功能脚本                             ║
 * ║                             app.js 目录索引                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                             ║
 * ║ 【核心功能】                                                                ║
 * ║   Line 30    - 加载动画控制（开场魔法阵动画）                               ║
 * ║   Line 45    - 性能优化：页面可见性检测                                     ║
 * ║   Line 80    - 性能优化：用户空闲检测                                       ║
 * ║   Line 355   - 时间显示功能（魔法时间系统）                                  ║
 * ║   Line 380   - 音乐播放器逻辑                                               ║
 * ║   Line 500   - 视差滚动效果                                                 ║
 * ║                                                                             ║
 * ║ 【功能模块】                                                                ║
 * ║   Line 550   - 塔罗牌系统（占卜 + AI解读）                                  ║
 * ║   Line 875   - 大图书馆（书籍展示 + 搜索）                                  ║
 * ║   Line 1090  - 侧边栏控制                                                  ║
 * ║   Line 1105  - 社区折叠功能                                                 ║
 * ║   Line 1110  - 社团详情功能（公会档案）                                      ║
 * ║   Line 1250  - AI对话功能（智能聊天）                                        ║
 * ║   Line 1430  - 天气系统（城市天气查询）                                      ║
 * ║                                                                             ║
 * ║ 【游戏/工具】                                                               ║
 * ║   Line 1540  - 五子棋系统（AI对战，含VCF/VCT搜索）                          ║
 * ║   Line 4140  - 星盘系统（占星术）                                           ║
 * ║   Line 4295  - 海德平衡理论系统（关系网络可视化）                           ║
 * ║   Line 5380  - MBTI研究数据系统（图表分析）                                  ║
 * ║                                                                             ║
 * ║ 【使用说明】                                                                ║
 * ║   - 使用 Ctrl+G 跳转到指定行号                                             ║
 * ║   - 使用 Ctrl+F 搜索 "====" 快速定位各模块                                  ║
 * ║                                                                             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

// ==================== 加载动画控制 ====================
        // 提前初始化音频元素
        const bgm = document.getElementById('magic-bgm');
        // 直接设置播放源为Constant Moderato
        bgm.src = '音乐/Constant Moderato.MP3';
        bgm.volume = 0.1;

        // 添加用户点击事件监听
        document.addEventListener('click', handleFirstPlay);

        // 防止动画重复播放的标志
        let loadingAnimationTriggered = false;

        // ==================== 性能优化：页面可见性检测 ====================
        // 当页面不可见时暂停视频和动画，减少资源消耗
        let wasVideoPlaying = false;
        let wasMusicPlaying = false;
        
        document.addEventListener('visibilitychange', () => {
            const bgVideo = document.getElementById('bgVideo');
            
            if (document.hidden) {
                // 页面隐藏时暂停视频和音乐
                if (bgVideo && !bgVideo.paused) {
                    wasVideoPlaying = true;
                    bgVideo.pause();
                }
                if (bgm && !bgm.paused) {
                    wasMusicPlaying = true;
                    bgm.pause();
                }
                // 通过CSS类暂停所有动画
                document.body.classList.add('page-hidden');
            } else {
                // 页面可见时恢复
                if (bgVideo && wasVideoPlaying) {
                    bgVideo.play().catch(() => {});
                    wasVideoPlaying = false;
                }
                if (bgm && wasMusicPlaying) {
                    bgm.play().catch(() => {});
                    wasMusicPlaying = false;
                }
                // 恢复CSS动画
                document.body.classList.remove('page-hidden');
            }
        });

        // ==================== 性能优化：用户空闲检测 ====================
        // 当用户长时间不活动时，降低视频质量或暂停视频
        let idleTimer = null;
        const IDLE_TIMEOUT = 60000; // 60秒无操作

        function resetIdleTimer() {
            if (idleTimer) clearTimeout(idleTimer);
            
            // 恢复正常状态
            const bgVideo = document.getElementById('bgVideo');
            if (bgVideo && bgVideo.paused && !document.hidden) {
                bgVideo.play().catch(() => {});
            }
            document.body.classList.remove('user-idle');
            
            idleTimer = setTimeout(() => {
                // 用户空闲时暂停视频以节省GPU
                const bgVideo = document.getElementById('bgVideo');
                if (bgVideo && !bgVideo.paused) {
                    bgVideo.pause();
                }
                document.body.classList.add('user-idle');
            }, IDLE_TIMEOUT);
        }

        // 监听用户活动
        ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, resetIdleTimer, { passive: true });
        });

        // 初始化空闲计时器
        resetIdleTimer();

        window.addEventListener('load', () => {
            // 在加载动画开始时尝试播放音乐
            bgm.play().catch(error => {
                console.log('自动播放被阻止，将在用户交互后播放');
            });

            const loader = document.querySelector('.magic-loader');
            
            // 生成动态星星
            for(let i = 0; i < 30; i++){
                const star = document.createElement('div');
                star.className = 'star';
                star.style.top = Math.random() * 100 + '%';
                star.style.left = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 2 + 's';
                loader.appendChild(star);
            }

            // 进度条结束后（2.5秒），等待用户点击
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                const clickHint = document.querySelector('.click-hint');
                
                // 显示点击提示
                if (clickHint) {
                    clickHint.style.opacity = '1';
                    clickHint.classList.add('show');
                }
                
                // 点击任意位置结束开场动画
                function endLoadingAnimation(e) {
                    // 防止重复触发
                    if (loadingAnimationTriggered) return;
                    loadingAnimationTriggered = true;
                    
                    // 阻止事件冒泡，防止触发其他监听器
                    if (e) {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    }
                    
                    // 移除点击监听
                    loadingScreen.removeEventListener('click', endLoadingAnimation);
                    
                    const magicLoader = document.querySelector('.magic-loader');
                    const circles = document.querySelectorAll('.magic-circle');
                    const core = document.querySelector('.magic-core');
                    const particles = document.querySelectorAll('.energy-particle');
                    const runes = document.querySelectorAll('.rune');
                    const hexagram = document.querySelector('.hexagram');
                    const text = document.querySelector('.loading-text');
                    const progress = document.querySelector('.loading-progress');
                    const runeRing = document.querySelector('.rune-ring');

                    // 隐藏点击提示
                    if (clickHint) {
                        clickHint.style.opacity = '0';
                    }
                    
                    // 获取魔法阵中心位置（相对于magic-loader）
                    const loaderRect = magicLoader.getBoundingClientRect();
                    const centerX = loaderRect.width / 2;
                    const centerY = loaderRect.height / 2;
                    
                    // ========== 第一阶段：中心爆发特效 ==========
                    
                    // 1. 核心光球爆发扩散
                    if (core) {
                        core.style.animation = 'coreExpand 1s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    }
                    
                    // 2. 魔法圆圈向外扩散（已经是居中的，使用CSS动画）
                    circles.forEach((circle, index) => {
                        setTimeout(() => {
                            circle.style.animation = 'ringExpand 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                        }, index * 100);
                    });
                    
                    // 3. 能量粒子向四周爆发
                    particles.forEach((particle, index) => {
                        const angle = (index / particles.length) * Math.PI * 2;
                        const distance = 300 + Math.random() * 200;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        particle.style.setProperty('--tx', tx + 'px');
                        particle.style.setProperty('--ty', ty + 'px');
                        particle.style.animation = 'particleBurst 1s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    });
                    
                    // 4. 符文飞散
                    runes.forEach((rune, index) => {
                        const angle = (index / runes.length) * Math.PI * 2;
                        const distance = 400 + Math.random() * 200;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        rune.style.setProperty('--tx', tx + 'px');
                        rune.style.setProperty('--ty', ty + 'px');
                        rune.style.animation = 'runeScatter 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                        rune.style.animationDelay = (index * 0.05) + 's';
                    });
                    
                    // 5. 六芒星扩散
                    if (hexagram) {
                        hexagram.style.animation = 'hexagramExpand 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    }

                    // 6. 符文环扩散
                    if (runeRing) {
                        runeRing.style.animation = 'runeRingExpand 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    }
                    
                    // 7. 创建额外的爆发粒子（从中心发出）
                    createBurstParticles(magicLoader, centerX, centerY);
                    
                    // 8. 创建扩散环（从中心发出）
                    createExpandRings(magicLoader, centerX, centerY);
                    
                    // 9. 文字上升消散
                    if (text) {
                        text.style.animation = 'textAscend 1s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    }
                    
                    // 10. 进度条闪光消失
                    if (progress) {
                        progress.style.animation = 'progressFlash 0.8s ease-out forwards';
                    }
                    
                    // ========== 第二阶段：圆形扩散揭示主页 ==========
                    // 延迟到所有动画完成后再创建圆形遮罩（最长动画 runeRingExpand 为 1.5s）
                    setTimeout(() => {
                        // 创建圆形扩散遮罩
                        createCircleReveal(loadingScreen);
                        
                        // 触发圆形扩散动画
                        setTimeout(() => {
                            loadingScreen.classList.add('circle-expanding');
                        }, 50);
                        
                        // 移除加载层并彻底清理动画
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            loadingScreen.classList.add('hidden'); // 添加hidden类彻底停止动画
                            document.body.style.overflow = 'auto';
                            
                            // 性能优化：清理开场动画的DOM元素，释放GPU资源
                            const magicLoaderEl = loadingScreen.querySelector('.magic-loader');
                            if (magicLoaderEl) {
                                magicLoaderEl.innerHTML = ''; // 清空所有子元素
                            }
                        }, 2000);
                    }, 1200);
                }

                // 创建爆发粒子（从指定中心点发出）
                function createBurstParticles(container, centerX, centerY) {
                    const particleCount = 30;
                    for (let i = 0; i < particleCount; i++) {
                        const particle = document.createElement('div');
                        particle.className = 'burst-particle';
                        
                        // 设置粒子初始位置为中心
                        particle.style.left = centerX + 'px';
                        particle.style.top = centerY + 'px';
                        particle.style.transform = 'translate(-50%, -50%)';
                        
                        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
                        const distance = 200 + Math.random() * 300;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        
                        particle.style.setProperty('--tx', tx + 'px');
                        particle.style.setProperty('--ty', ty + 'px');
                        particle.style.animation = `particleBurst ${0.8 + Math.random() * 0.4}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
                        particle.style.animationDelay = (Math.random() * 0.2) + 's';
                        
                        // 随机大小
                        const size = 4 + Math.random() * 8;
                        particle.style.width = size + 'px';
                        particle.style.height = size + 'px';
                        
                        container.appendChild(particle);
                    }
                }
                
                // 创建扩散环（从指定中心点发出）
                function createExpandRings(container, centerX, centerY) {
                    const ringCount = 4;
                    for (let i = 0; i < ringCount; i++) {
                        const ring = document.createElement('div');
                        ring.className = 'expand-ring';
                        
                        const size = 80 + i * 40;
                        ring.style.width = size + 'px';
                        ring.style.height = size + 'px';
                        // 设置环的中心位置
                        ring.style.left = centerX + 'px';
                        ring.style.top = centerY + 'px';
                        ring.style.transform = 'translate(-50%, -50%)';
                        ring.style.animation = `ringExpandFromCenter ${1 + i * 0.2}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
                        ring.style.animationDelay = (i * 0.15) + 's';
                        
                        container.appendChild(ring);
                    }
                }

                // 创建圆形扩散揭示效果
                function createCircleReveal(loadingScreen) {
                    // 检查是否已存在圆形遮罩
                    if (loadingScreen.querySelector('.circle-mask')) return;
                    
                    // 隐藏magic-loader内容，防止动画重播
                    const magicLoaderElement = loadingScreen.querySelector('.magic-loader');
                    if (magicLoaderElement) {
                        magicLoaderElement.style.visibility = 'hidden';
                        magicLoaderElement.style.opacity = '0';
                    }
                    
                    // 创建圆形遮罩容器
                    const circleMask = document.createElement('div');
                    circleMask.className = 'circle-mask';
                    
                    // 创建发光边缘
                    const glowRing = document.createElement('div');
                    glowRing.className = 'circle-glow-ring';
                    circleMask.appendChild(glowRing);
                    
                    loadingScreen.appendChild(circleMask);
                }
                
                loadingScreen.addEventListener('click', endLoadingAnimation);
            }, 2500); // 进度条动画持续时间
        });

        // 新增首次播放处理函数
        function handleFirstPlay() {
            bgm.play()
                .then(() => {
                    document.removeEventListener('click', handleFirstPlay);
                })
                .catch(console.error);
        }

        document.body.style.overflow = 'hidden';

        // ==================== 时间显示功能 ====================
        function updateMagicTime() {
            const timeContainer = document.getElementById('time-system');
            const now = new Date();
            
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const weekDays = ['魔曜日', '星耀日', '月曜日', '炎曜日', '水曜日', '木曜日', '圣曜日'];
            const week = weekDays[now.getDay()];
            
            timeContainer.innerHTML = `
                <span>${year}年${month}月${date}日 ${week}</span>
                <span style="font-size:1em; margin:0 0.8rem; opacity:0.7;">—</span>
                <span style="font-size:1.05em; font-weight:500;">${hours}:${minutes}:${seconds}</span>
            `;
        }

        updateMagicTime();
        setInterval(updateMagicTime, 1000);
        // 移除不必要的3秒textShadow更新，减少CPU消耗

        // ==================== 音乐播放器逻辑 ====================
        let isFirstPlay = true;
        let playMode = 'list-loop';
        const songs = [
            { url: '音乐/Constant Moderato.MP3', title: 'Constant Moderato' },
            { url: '音乐/恋风.MP3', title: '恋风' },
            { url: '音乐/雪玫瑰的誓约.MP3', title: '雪玫瑰的誓约' },
            { url: '音乐/缘刃之歌.MP3', title: '缘刃之歌' }
        ];
        let currentSongIndex = 0;

        document.querySelectorAll('.song-list li').forEach((li, index) => {
            li.addEventListener('click', function() {
                const songData = this.dataset;
                playSong(songData.url, songData.title, index);
            });
        });

        function initMusic() {
            // 已提前设置好音源，无需重复操作
            document.getElementById('play-icon').textContent = '⏸️';
            document.getElementById('current-song').textContent = '当前曲目：Constant Moderato';
        }

        // 在开场动画结束后初始化播放器状态
        setTimeout(initMusic, 3000);

        function toggleMusic() {
            if(isFirstPlay) {
                initMusic();
                isFirstPlay = false;
            }
            bgm.paused ? bgm.play() : bgm.pause();
            document.getElementById('play-icon').textContent = bgm.paused ? '▶️' : '⏸️';
        }

        function playSong(url, title, index) {
            currentSongIndex = index;
            bgm.src = url;
            bgm.play();
            document.getElementById('current-song').textContent = `当前曲目：${title}`;
            isFirstPlay = false;
            
            document.querySelectorAll('.song-list li').forEach(li => {
                li.style.background = li.dataset.title === title ? '#e1f5fe' : '';
            });
        }

        bgm.addEventListener('ended', () => {
            if(playMode === 'random') {
                currentSongIndex = Math.floor(Math.random() * songs.length);
            } else {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
            }
            const nextSong = songs[currentSongIndex];
            playSong(nextSong.url, nextSong.title, currentSongIndex);
        });

        function toggleMode() {
            const modeIcon = document.getElementById('mode-icon');
            playMode = playMode === 'list-loop' ? 'random' : 'list-loop';
            modeIcon.textContent = playMode === 'list-loop' ? '🔁' : '🔀';
            showMagicToast(`已切换至${playMode === 'list-loop' ? '列表循环' : '随机播放'}模式`);
        }

        function showMagicToast(text) {
            const toast = document.createElement('div');
            toast.textContent = text;
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = 'rgba(135,206,235,0.9)';
            toast.style.color = 'white';
            toast.style.padding = '8px 15px';
            toast.style.borderRadius = '20px';
            toast.style.boxShadow = '0 2px 10px rgba(135,206,235,0.5)';
            toast.style.animation = 'slideIn 0.5s, fadeOut 0.5s 2s';
            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 2500);
        }

        function updateProgress() {
            const progress = (bgm.currentTime / bgm.duration) * 100 || 0;
            document.getElementById('progress').value = progress;
            document.getElementById('current-time').textContent = formatTime(bgm.currentTime);
        }

        function updateDuration() {
            document.getElementById('duration').textContent = formatTime(bgm.duration);
        }

        function seekAudio(value) {
            const seekTime = (value / 100) * bgm.duration;
            bgm.currentTime = seekTime;
        }

        function adjustVolume(value) {
            bgm.volume = value;
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        let isCollapsed = true;

        function toggleCollapse() {
            const player = document.querySelector('.music-control');
            player.classList.toggle('collapsed');
            isCollapsed = !isCollapsed;
            const toggleBtn = document.querySelector('.toggle-collapse-btn');
            // 折叠状态显示▼（向下箭头表示可以展开），展开状态显示▲（向上箭头表示可以收起）
            toggleBtn.textContent = isCollapsed ? '▼' : '▲';
        }

        // ==================== 视差滚动效果（性能优化版）====================
        // 使用节流函数优化滚动性能，避免持续的requestAnimationFrame循环
        let scrollTicking = false;
        
        function updateVideoPosition() {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    
            // 计算视频移动范围
            const videoMoveRange = 4;
            const translateY = -scrollProgress * videoMoveRange + "%";
    
            // 使用will-change提示浏览器优化
            if (typeof bgVideo !== 'undefined' && bgVideo) {
                bgVideo.style.transform = `translateY(${translateY})`;
            }
            
            // 更新视差背景
            const parallax = document.querySelector('.parallax-background');
            if (parallax) {
                parallax.style.transform = `translateY(${-scrollY * 0.5}px)`;
            }
            
            scrollTicking = false;
        }

        // 仅在滚动时更新，不使用持续的requestAnimationFrame循环
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(updateVideoPosition);
                scrollTicking = true;
            }
        }, { passive: true });

        // 初始化
        window.addEventListener('DOMContentLoaded', () => {
            // 设置视频初始位置
            if (typeof bgVideo !== 'undefined' && bgVideo) {
                bgVideo.style.transform = "translateY(0)";
                bgVideo.play();
            }
        })



        // 注意：开场动画点击播放音乐已在 handleFirstPlay 中处理，无需重复绑定

        // ==================== 塔罗牌系统逻辑 ====================
        const tarotDeck = [
            {
                name: "愚者",
                image: "图片/BA塔罗/0-愚者.png",
                upright: "新的开始、冒险精神、率真自由",
                reversed: "鲁莽行事、缺乏计划、不切实际"
            },
            {
                name: "魔术师",
                image: "图片/BA塔罗/1-魔术师.png",
                upright: "创造力、资源整合、自信主动",
                reversed: "欺骗、资源浪费、能力不足"
            },
            {
                name: "女祭司",
                image: "图片/BA塔罗/2-女祭司.png",
                upright: "直觉敏锐、神秘智慧、潜意识探索",
                reversed: "隐藏真相、情绪压抑、过度理性"
            },
            {
                name: "女皇",
                image: "图片/BA塔罗/3-女皇.png",
                upright: "母性滋养、丰收丰裕、自然和谐",
                reversed: "依赖物质、生育问题、情感失衡"
            },
            {
                name: "皇帝",
                image: "图片/BA塔罗/4-皇帝.png",
                upright: "权威领导、稳定结构、自律掌控",
                reversed: "专制独裁、僵化思维、权力滥用"
            },
            {
                name: "教皇",
                image: "图片/BA塔罗/5-教皇.png",
                upright: "传统信仰、精神指引、道德规范",
                reversed: "盲从教条、思想束缚、虚假仁慈"
            },
            {
                name: "恋人",
                image: "图片/BA塔罗/6-恋人.png",
                upright: "灵魂契合、重大选择、人际关系",
                reversed: "情感纠纷、错误决定、价值观冲突"
            },
            {
                name: "战车",
                image: "图片/BA塔罗/7-战车.png",
                upright: "意志决胜、掌控方向、积极进取",
                reversed: "失控冲突、缺乏方向、精力分散"
            },
            {
                name: "正义",
                image: "图片/BA塔罗/8-正义.png",
                upright: "公平裁决、因果法则、理性分析",
                reversed: "偏见不公、逃避责任、法律问题"
            },
            {
                name: "隐者",
                image: "图片/BA塔罗/9-隐者.png",
                upright: "智慧沉淀、向内探索、谨慎规划",
                reversed: "孤独封闭、过度谨慎、错失良机"
            },
            {
                name: "命运之轮",
                image: "图片/BA塔罗/10-命运之轮.png",
                upright: "命运转折、周期循环、机缘巧合",
                reversed: "逆境无常、抗拒改变、运气低落"
            },
            {
                name: "力量",
                image: "图片/BA塔罗/11-力量.png",
                upright: "内在勇气、以柔克刚、信念坚定",
                reversed: "情绪失控、信心丧失、滥用力量"
            },
            {
                name: "吊人",
                image: "图片/BA塔罗/12-吊人.png",
                upright: "换位思考、精神觉醒、暂时停顿",
                reversed: "无谓牺牲、固执己见、逃避现实"
            },
            {
                name: "死神",
                image: "图片/BA塔罗/13-死神.png",
                upright: "必然结束、蜕变新生、断舍离",
                reversed: "抗拒改变、停滞不前、恐惧失去"
            },
            {
                name: "节制",
                image: "图片/BA塔罗/14-节制.png",
                upright: "平衡调和、循序渐进、自我疗愈",
                reversed: "极端失衡、资源浪费、情绪消耗"
            },
            {
                name: "恶魔",
                image: "图片/BA塔罗/15-恶魔.png",
                upright: "物质沉迷、欲望束缚、阴影面",
                reversed: "挣脱枷锁、欲望解放、看清真相"
            },
            {
                name: "塔",
                image: "图片/BA塔罗/16-塔.png",
                upright: "突发剧变、打破幻想、危机觉醒",
                reversed: "逃避问题、累积隐患、自我压抑"
            },
            {
                name: "星星",
                image: "图片/BA塔罗/17-星星.png",
                upright: "希望重生、灵感涌现、心灵疗愈",
                reversed: "希望渺茫、灵感枯竭、情绪悲观"
            },
            {
                name: "月亮",
                image: "图片/BA塔罗/18-月亮.png",
                upright: "潜意识波动、直觉预警、内在恐惧",
                reversed: "识破幻象、情绪平复、直面阴影"
            },
            {
                name: "太阳",
                image: "图片/BA塔罗/19-太阳.png",
                upright: "活力充沛、成功达成、坦诚直率",
                reversed: "暂时低潮、盲目乐观、儿童问题"
            },
            {
                name: "审判",
                image: "图片/BA塔罗/20-审判.png",
                upright: "灵魂觉醒、因果清算、重生召唤",
                reversed: "自我怀疑、逃避觉醒、重复错误"
            },
            {
                name: "世界",
                image: "图片/BA塔罗/21-世界.png",
                upright: "圆满达成、和谐整合、旅程结束",
                reversed: "未完成、延迟、需要妥协"
            }
        ];

        function createStarParticles() {
            const container = document.getElementById('starParticles');
            if (!container) return;
            container.innerHTML = '';
            
            // 创建更多样化的星星粒子
            const particleCount = 30;
            for(let i = 0; i < particleCount; i++) {
                const star = document.createElement('div');
                star.className = 'star-particle';
                
                // 随机位置（集中在中心区域）
                const centerX = 50 + (Math.random() - 0.5) * 60;
                const centerY = 40 + (Math.random() - 0.5) * 40;
                star.style.left = centerX + '%';
                star.style.top = centerY + '%';
                
                // 随机大小
                const size = Math.random() * 18 + 8;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                // 随机移动方向和距离
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 150 + 100;
                star.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
                star.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
                
                // 随机延迟
                star.style.animationDelay = (Math.random() * 0.5) + 's';
                star.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
                
                container.appendChild(star);
            }
        }

         // 新增动画状态锁
        let isAnimating = false;
        let currentReading = []; // 存储当前抽牌结果

        function drawTarot() {
            // 打开时锁定滚动
            document.documentElement.style.overflow = 'hidden';

            const container = document.getElementById('tarotContainer');
            const triple = container.querySelector('.tarot-triple');
            const cards = triple.querySelectorAll('.tarot-card');
        
            // 点击关闭
            container.onclick = (e) => {
                // 仅当点击在容器背景区域时关闭（排除所有子元素的点击）
                if (e.target === container || e.target.classList.contains('tarot-close-hint')) {
                    container.style.display = 'none';
                    document.documentElement.style.overflow = '';
                }
            };

            // 生成不重复的三张牌
            const selectedCards = [];
            while(selectedCards.length < 3) {
                const card = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
                if(!selectedCards.includes(card)) selectedCards.push(card);
            }

            const positionLabels = ['过去', '现在', '未来'];

            cards.forEach((card, index) => {
                const isReversed = Math.random() > 0.5;
                const tarotImg = card.querySelector('.tarot-image');
                const tarotName = card.querySelector('.tarot-name');
                const tarotMeaning = card.querySelector('.tarot-meaning');
                const selected = selectedCards[index];

                // 重置卡牌状态
                card.classList.remove('flipped');
                card.style.opacity = '0';
                
                // 设置图片
                tarotImg.classList.remove('reversed');
                if (isReversed) {
                    tarotImg.classList.add('reversed');
                }
                tarotImg.src = selected.image;
                
                tarotName.textContent = `${selected.name} ${isReversed ? '逆位' : '正位'}`;
                tarotMeaning.textContent = isReversed ? selected.reversed : selected.upright;

                // 延迟入场动画
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease';
                    card.style.opacity = '1';
                }, index * 200);

                // 点击单个卡片翻转
                card.onclick = (e) => {
                    e.stopPropagation();
                    
                    // 移除之前的动画类
                    card.classList.remove('flipping', 'unflipping');
                    
                    // 判断是翻开还是翻回
                    if (card.classList.contains('flipped')) {
                        // 翻回背面
                        card.classList.add('unflipping');
                        card.classList.remove('flipped');
                    } else {
                        // 翻开正面
                        card.classList.add('flipping', 'flipped');
                    }
                    
                    // 动画结束后移除动画类
                    setTimeout(() => {
                        card.classList.remove('flipping', 'unflipping');
                    }, 800);
                    
                    createStarParticles();
                };
            });

            container.style.display = 'flex';
            createStarParticles();

            currentReading = selectedCards.map((card, index) => {
                const isReversed = cards[index].querySelector('.tarot-image').classList.contains('reversed');
                return {
                    name: card.name,
                    position: isReversed ? '逆位' : '正位',
                    meaning: isReversed ? card.reversed : card.upright,
                    timePosition: positionLabels[index]
                };
            });

            // 重置AI解读区域
            document.getElementById('tarotAIReading').innerHTML = '<p style="text-align:center; color:#87CEEB;">翻开三张牌后，点击下方按钮获取专属解读...</p>';
        }

        // 关闭时恢复滚动（已在drawTarot函数中处理）

        // AI解读生成函数
        async function generateAIReading() {
            const readingArea = document.getElementById('tarotAIReading');
            
            // 检查是否已翻开卡牌
            const flippedCards = document.querySelectorAll('.tarot-card.flipped');
            if (flippedCards.length === 0) {
                readingArea.innerHTML = '<p style="text-align:center; color:#e57373;">✦ 请先点击卡牌翻开查看 ✦</p>';
                return;
            }
            
            readingArea.innerHTML = '<div class="loading">星辰轨迹正在解析中...</div>';
    
            // 构建提示词（包含时间位置）
            const prompt = `你是一位亲切的塔罗牌解读师，请用通俗易懂的大白话解读以下三张牌，就像和朋友聊天一样自然：
            1. 【${currentReading[0].timePosition || '过去'}】${currentReading[0].name}（${currentReading[0].position}）：${currentReading[0].meaning}
            2. 【${currentReading[1].timePosition || '现在'}】${currentReading[1].name}（${currentReading[1].position}）：${currentReading[1].meaning}
            3. 【${currentReading[2].timePosition || '未来'}】${currentReading[2].name}（${currentReading[2].position}）：${currentReading[2].meaning}
    
            请以以下结构解读：
            (1) 整体运势概况 - 用日常生活的语言说说整体情况
            (2) 三牌关系解读 - 像讲故事一样把三张牌串起来，说说过去现在未来的联系
            (3) 给求问者的建议 - 给出实用的、接地气的建议
            
            重要要求：
            - 避免使用"星辰"、"命运之轮"、"灵魂深处"等抽象晦涩的词汇
            - 多用"你可能会"、"建议你"、"最近"、"注意"等日常用语
            - 像和朋友聊天一样，说人话，接地气
            - 每部分约80-100字，简洁明了`;

            try {
                const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer sk-4df7260e2d8948eab5f7d3d787c9d60f'
                    },
                    body: JSON.stringify({
                        model: "deepseek-r1",
                        messages: [{role: "user", content: prompt}],
                        temperature: 0.85
                    })
                });

                const data = await response.json();
                const interpretation = data.choices[0].message.content;
                readingArea.innerHTML = interpretation.replace(/\n/g, '<br>');
            } catch (error) {
                readingArea.innerHTML = '<p style="text-align:center; color:#e57373;">星辰轨迹暂时模糊，请稍后再试...</p>';
            }
        }
        // ==================== 大图书馆 ====================



        // 大图书馆数据 - 带分类
        const libraryCollection = [
            // ========== 神秘学（包含占星术、魔法等） ==========
            {
                title: "内在的天空",
                pdf: "pdf/内在的天空.pdf",
                thumb: "书籍封面/内在的天空.png",
                category: "occult"
            },
            {
                title: "德鲁伊魔法手册", 
                pdf: "pdf/德鲁伊魔法手册.pdf",
                thumb: "书籍封面/德鲁伊魔法手册.png",
                category: "occult"
            },
            {
                title: "威卡魔法手册",
                pdf: "pdf/威卡魔法手册.pdf",
                thumb: "书籍封面/威卡魔法手册.png",
                category: "occult"
            },
            {
                title: "所罗门的钥匙",
                pdf: "pdf/所罗门的钥匙.pdf",
                thumb: "书籍封面/所罗门的钥匙.png",
                category: "occult"
            },
            // ========== 本人专著（轨迹魔女见闻录系列） ==========
            ...Array.from({length:36}, (_,i) => ({
                title: `轨迹魔女见闻录 第${i+1}卷`,
                pdf: i === 0 ? "pdf/轨迹魔女见闻录 第一卷.pdf" : null,
                thumb: `小说封面/轨迹魔女见闻录-${i+1}.jpg`,
                category: "personal"
            }))
        ];

        // 当前筛选状态
        let currentCategory = 'all';
        let currentSearchTerm = '';

        // 打开大图书馆
        function loadLibrary() {
            document.documentElement.style.overflow = 'hidden';
            const modal = document.getElementById('libraryModal');
            
            // 重置筛选状态
            currentCategory = 'all';
            currentSearchTerm = '';
            document.getElementById('librarySearchInput').value = '';
            
            // 重置分类按钮状态
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.dataset.category === 'all') btn.classList.add('active');
            });
            
            // 更新分类标题
            updateCategoryTitle('all');
            
            // 渲染书籍
            renderBooks();
            
            // 显示弹窗
            modal.style.display = 'flex';
            createStarParticles();
        }

        // 渲染书籍
        function renderBooks() {
            const grid = document.querySelector('.library-grid-modal');
            const noResults = document.getElementById('noResults');
            grid.innerHTML = '';
            
            // 筛选书籍
            let filteredBooks = libraryCollection.filter(book => {
                const matchCategory = currentCategory === 'all' || book.category === currentCategory;
                const matchSearch = currentSearchTerm === '' || 
                    book.title.toLowerCase().includes(currentSearchTerm.toLowerCase());
                return matchCategory && matchSearch;
            });
            
            // 更新计数
            document.getElementById('bookCount').textContent = filteredBooks.length;
            
            // 显示/隐藏无结果提示
            if(filteredBooks.length === 0) {
                noResults.style.display = 'flex';
                grid.style.display = 'none';
            } else {
                noResults.style.display = 'none';
                grid.style.display = 'grid';
            }
            
            // 生成书籍卡片
            filteredBooks.forEach((book, index) => {
                const card = document.createElement('div');
                card.className = 'pdf-card magic-hover';
                card.style.animationDelay = `${index * 0.05}s`;
                
                // 如果没有PDF，添加"敬请期待"标记
                const noPdfBadge = book.pdf ? '' : '<div class="coming-soon-badge">敬请期待</div>';
                
                card.innerHTML = `
                    <div class="pdf-thumbnail" 
                         style="background: url('${book.thumb}') center/cover;">
                         ${noPdfBadge}
                    </div>
                    <div class="pdf-info">
                        <p class="pdf-title">${book.title}</p>
                        <span class="pdf-category">${getCategoryName(book.category)}</span>
                    </div>
                `;
                card.style.transform = `rotateY(${Math.random()*6-3}deg) rotateZ(${Math.random()*2-1}deg)`;
                
                // 只有有PDF的书籍才能点击打开
                if (book.pdf) {
                    card.addEventListener('click', () => window.open(book.pdf, '_blank'));
                } else {
                    card.style.cursor = 'default';
                    card.style.opacity = '0.7';
                }
                
                grid.appendChild(card);
            });
        }

        // 获取分类名称
        function getCategoryName(category) {
            const names = {
                personal: '本人专著', occult: '神秘学',
                philosophy: '哲学', psychology: '心理学', history: '历史', literature: '文学',
                economics: '经济', law: '法学', education: '教育', sociology: '社会学', politics: '政治',
                computer: '计算机', ai: 'AI', math: '数学',
                physics: '物理', chemistry: '化学', biology: '生物', astronomy: '天文', geography: '地理',
                medicine: '医学', mechanical: '机械', civil: '土木', electrical: '电气', materials: '材料',
                environment: '环境', agriculture: '农学',
                art: '艺术', music: '音乐', film: '影视', sports: '体育',
                military: '军事', religion: '宗教', mythology: '神话'
            };
            return names[category] || '未分类';
        }

        // 筛选分类
        function filterCategory(category) {
            currentCategory = category;
            
            // 更新按钮状态
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.dataset.category === category) btn.classList.add('active');
            });
            
            // 更新分类标题
            updateCategoryTitle(category);
            
            renderBooks();
        }

        // 更新分类标题
        function updateCategoryTitle(category) {
            const titleEl = document.querySelector('.current-category');
            const icons = {
                all: '', personal: '', occult: '',
                philosophy: '', psychology: '', history: '', literature: '',
                economics: '', law: '', education: '', sociology: '', politics: '',
                computer: '', ai: '', math: '',
                physics: '', chemistry: '', biology: '', astronomy: '', geography: '',
                medicine: '', mechanical: '', civil: '', electrical: '', materials: '',
                environment: '', agriculture: '',
                art: '', music: '', film: '', sports: '',
                military: '', religion: '', mythology: ''
            };
            const names = {
                all: '全部书籍', personal: '本人专著', occult: '神秘学',
                philosophy: '哲学', psychology: '心理学', history: '历史', literature: '文学',
                economics: '经济', law: '法学', education: '教育', sociology: '社会学', politics: '政治',
                computer: '计算机', ai: 'AI', math: '数学',
                physics: '物理', chemistry: '化学', biology: '生物', astronomy: '天文', geography: '地理',
                medicine: '医学', mechanical: '机械工程', civil: '土木建筑', electrical: '电气工程', materials: '材料科学',
                environment: '环境科学', agriculture: '农学',
                art: '艺术', music: '音乐', film: '影视', sports: '体育',
                military: '军事', religion: '宗教', mythology: '神话传说'
            };
            titleEl.textContent = `${icons[category] || '📚'} ${names[category] || '全部书籍'}`;
        }

        // 搜索书籍
        function searchBooks() {
            currentSearchTerm = document.getElementById('librarySearchInput').value;
            renderBooks();
        }

        // 清除搜索
        function clearSearch() {
            document.getElementById('librarySearchInput').value = '';
            currentSearchTerm = '';
            renderBooks();
        }

        // 关闭大图书馆
        function closeLibrary() {
            document.getElementById('libraryModal').style.display = 'none';
            document.documentElement.style.overflow = '';
        }

        // 点击外部关闭
        document.getElementById('libraryModal').addEventListener('click', function(e) {
            if(e.target === this) closeLibrary();
        });

        // ==================== 侧边栏控制 ====================
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleBtn');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        // 点击外部关闭侧边栏
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // ==================== 社区折叠功能 ====================
        function toggleCommunity(header) {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        }

        // ==================== 知识体系分类折叠功能 ====================
        function toggleKnowledgeCategory(header) {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        }

        // ==================== 知识详情功能 ====================
        const knowledgeData = [
            {
                title: '卢恩符文',
                subtitle: 'Runes - 北欧神秘传统',
                description: '卢恩符文（Runes）源于早期日耳曼语族，是一套兼具语言符号与神秘能量的古老系统。每个符文不仅代表特定的音素，更承载着宇宙法则与自然力量的象征意义。在北欧神话中，奥丁通过自我牺牲获得了符文的智慧，使其成为连接人类与神性的桥梁。',
                keyPoints: [
                    '24个长老福萨克符文体系',
                    '符文占卜与冥想实践',
                    '北欧神话的宇宙观映射',
                    '符号魔法与意识转化'
                ]
            },
            {
                title: '德鲁伊传统',
                subtitle: 'Druidry - 凯尔特自然智慧',
                description: '德鲁伊（Druid）是古代凯尔特社会的祭司、哲学家与自然观察者。这一传统强调人与自然的深层连接，通过仪式、草药学与天文观测来理解宇宙的循环规律。德鲁伊相信万物有灵，树木、河流、山脉都蕴含着神圣的力量。',
                keyPoints: [
                    '八大节日轮转（生命之轮）',
                    '树木智慧与植物魔法',
                    '三界观：陆地、海洋、天空',
                    '口传传统与诗歌吟唱'
                ]
            },
            {
                title: '威卡传统',
                subtitle: 'Wicca - 现代巫术复兴',
                description: '威卡（Wicca）是20世纪中叶兴起的现代异教运动，融合了古代欧洲民间信仰、仪式魔法与自然崇拜。强调二元神性（女神与男神）、自然节律与个人灵性成长。威卡实践者通过仪式、咒语与能量工作来实现自我转化与世界和谐。',
                keyPoints: [
                    '威卡教条：不伤害任何人',
                    '魔法圈与四元素召唤',
                    '满月仪式（Esbat）与节日庆典',
                    '草药、水晶与蜡烛魔法'
                ]
            },
            {
                title: '荣格分析心理学',
                subtitle: 'Carl Jung - 集体无意识理论',
                description: '卡尔·荣格（Carl Jung）提出的集体无意识理论认为，人类共享着超越个体经验的心理结构。原型（Archetypes）作为集体无意识的内容，在神话、梦境与虚拟世界中反复显现。荣格的理论为理解虚拟社群中的符号系统与角色扮演提供了深刻的心理学视角。',
                keyPoints: [
                    '集体无意识与原型理论',
                    '心理功能与类型理论（MBTI基础）',
                    '阴影、阿尼玛/阿尼姆斯',
                    '个体化进程（Individuation）',
                    '共时性（Synchronicity）现象'
                ]
            },
            {
                title: '拉康精神分析',
                subtitle: 'Jacques Lacan - 符号秩序理论',
                description: '雅克·拉康（Jacques Lacan）重新解读弗洛伊德，提出"镜像阶段"与"三界理论"（实在界、想象界、符号界）。在虚拟世界中，主体通过符号系统构建自我认同，虚拟化身成为镜像阶段的延伸，反映了主体对完整性的永恒追求。',
                keyPoints: [
                    '镜像阶段与自我建构',
                    '大他者（Big Other）与符号秩序',
                    '欲望的辩证法',
                    '语言作为无意识的结构'
                ]
            },
            {
                title: '福柯权力理论',
                subtitle: 'Michel Foucault - 知识考古学',
                description: '米歇尔·福柯（Michel Foucault）通过"知识考古学"与"系谱学"方法，揭示权力如何通过话语、规训与监控机制渗透社会。虚拟空间同样存在着微观权力网络，社群规则、平台算法与用户行为共同构成了新的权力/知识复合体。',
                keyPoints: [
                    '权力/知识复合体',
                    '规训社会与全景监狱',
                    '话语实践与主体生产',
                    '生命政治（Biopolitics）'
                ]
            },
            {
                title: '海德平衡理论',
                subtitle: 'Fritz Heider - 认知一致性',
                description: '弗里茨·海德（Fritz Heider）的平衡理论探讨人际关系中的认知一致性。在虚拟社群中，成员通过调整态度与关系来维持心理平衡，形成稳定的社交网络结构。该理论有助于理解虚拟社群中的派系形成、冲突解决与联盟建立。',
                keyPoints: [
                    'P-O-X三元关系模型',
                    '认知平衡与失衡状态',
                    '态度改变的动力机制',
                    '社会认知的结构化'
                ]
            },
            {
                title: '虚拟民族志',
                subtitle: 'Virtual Ethnography - 数字田野调查',
                description: '虚拟民族志（Virtual Ethnography）是将传统人类学田野调查方法应用于网络空间的研究范式。通过参与观察、深度访谈与文本分析，理解虚拟社群的文化实践与意义建构。这一方法论为研究元宇宙社群提供了系统化的理论框架。',
                keyPoints: [
                    '在线参与式观察',
                    '数字档案与文本分析',
                    '虚拟身份与表演性',
                    '跨平台文化比较研究'
                ]
            },
            {
                title: '炼金术',
                subtitle: 'Alchemy - 转化的艺术',
                description: '炼金术（Alchemy）是一门古老的神秘科学，起源于希腊化时期的埃及，融合了化学、哲学、神秘主义与灵性实践。炼金术士追求的不仅是将贱金属转化为黄金的物质目标，更是灵魂的净化与精神的升华。炼金术的象征体系深刻影响了荣格心理学、塔罗牌和现代神秘学。',
                keyPoints: [
                    '大作（Magnum Opus）的四个阶段',
                    '贤者之石与灵性转化',
                    '炼金术符号与象征体系',
                    '荣格对炼金术的心理学解读'
                ]
            },
            {
                title: '占星术',
                subtitle: 'Astrology - 星辰的智慧',
                description: '占星术（Astrology）是研究天体运动与人类事务之间关系的古老学问，起源于美索不达米亚文明。占星术认为行星、星座和宫位的配置反映了宇宙能量的模式，影响着个人性格、命运和集体事件。现代占星术融合了心理学视角，成为自我认知和灵性成长的工具。',
                keyPoints: [
                    '十二星座与四元素',
                    '行星的象征意义与能量',
                    '本命盘解读与宫位系统',
                    '行运、推运与时间占星'
                ]
            },
            {
                title: '卡巴拉',
                subtitle: 'Kabbalah - 生命之树',
                description: '卡巴拉（Kabbalah）是犹太神秘主义的核心传统，通过生命之树（Tree of Life）的象征体系揭示宇宙的结构和神性的本质。生命之树由十个质点（Sephiroth）和二十二条路径组成，代表神性流溢的过程和灵魂回归的道路。卡巴拉深刻影响了西方神秘学、塔罗牌和仪式魔法。',
                keyPoints: [
                    '生命之树的十个质点',
                    '四个世界与神性流溢',
                    '二十二条路径与希伯来字母',
                    '卡巴拉冥想与灵性实践'
                ]
            }
        ];

        // 知识详情扩展内容（多页内容）
        const knowledgeExtendedContent = [
            // 卢恩符文
            [
                {
                    title: '符文的起源与神话',
                    content: '<p>卢恩符文最早可追溯至公元2世纪，在斯堪的纳维亚半岛和日耳曼部落中广泛使用。根据《诗体埃达》记载，主神奥丁为获得符文智慧，将自己倒吊在世界之树尤克特拉希尔上九天九夜，不进食不饮水，最终以自我牺牲换取了这套神圣的符号系统。这一神话象征着通过苦行与牺牲获得深层智慧的过程。</p><p>每个符文都是宇宙能量的凝结，既是文字也是咒语，更是通往神性的钥匙。符文的名称本身就蕴含着魔法力量，如"Runa"在古诺尔斯语中意为"秘密"或"低语"，暗示着符文是神灵与人类之间的秘密语言。</p><p>在维京时代，符文不仅用于书写，更被刻在武器、船只和墓碑上，作为保护符和力量的象征。</p>'
                },
                {
                    title: '长老福萨克体系详解',
                    content: '<p>最古老的符文系统——长老福萨克（Elder Futhark）包含24个符文，分为三组（Aettir），每组8个。</p><p>第一组（Freyr\'s Aett）由丰饶之神弗雷掌管，包括Fehu（财富）、Uruz（原始力量）、Thurisaz（巨人之门）等，象征生育、繁荣与物质世界的力量。第二组（Heimdall\'s Aett）由守护神海姆达尔守护，包括Hagalaz（冰雹）、Nauthiz（需求）、Isa（冰）等，代表秩序、防御与转化的力量。第三组（Tyr\'s Aett）属于战神提尔，包括Tiwaz（战士）、Berkana（桦树）、Ehwaz（马）等，象征战争、正义与精神成长。</p><p>每个符文都有其独特的音值、象征意义和魔法用途，形成了一个完整的宇宙观体系。例如，Ansuz符文代表神圣的言语和智慧，与奥丁直接相关；Raidho符文象征旅程与节奏，提醒我们生命是一场不断前行的旅程。</p>'
                },
                {
                    title: '占卜实践与解读',
                    content: '<p>符文占卜是一种通过随机抽取符文石来解读当前能量状态和未来趋势的神秘实践。占卜者首先需要制作或选择一套符文石，通常使用木片、石头或陶土，并在上面刻画符文符号。占卜前，实践者会进入冥想状态，清空杂念，让潜意识引导符文的选择。</p><p>常见的布阵方法包括：单符文抽取（用于日常指引）、三符文展开（过去-现在-未来，揭示事件的发展脉络）、九宫格布局（Wyrd网格，探索复杂情境的多个层面）以及凯尔特十字展开（深度分析重大问题）。</p><p>符文的正位和逆位有不同的含义，正位通常代表能量的顺畅流动，逆位则暗示阻碍或需要内省的领域。解读符文不仅依赖于符号的传统意义，更需要占卜者的直觉和对当事人情境的理解。符文占卜的核心在于揭示隐藏的模式和潜在的可能性，而非预测固定的未来。</p>'
                },
                {
                    title: '现代应用与实践',
                    content: '<p>在当代神秘学实践中，符文被广泛用于冥想、护身符制作、能量工作和个人成长。许多实践者将符文刻在木片、石头、金属或水晶上，作为个人的灵性工具和能量焦点。</p><p>符文冥想是一种深度的内省实践，通过专注于特定符文的形状、意义和能量，实践者可以与该符文所代表的宇宙原型建立连接。例如，冥想Sowilo（太阳符文）可以增强个人的生命力和自信，而冥想Isa（冰符文）则有助于培养耐心和内在的宁静。</p><p>符文魔法强调意图的力量，实践者通过在仪式中吟唱符文的名称（Galdr）、绘制符文符号（Sigil）或将多个符文组合成魔法公式（Bind Rune），来调动相应的宇宙能量并实现特定的目标。现代符文实践者还将符文与其他神秘学体系结合，如塔罗、占星术和能量疗愈，创造出丰富多样的灵性实践方法。符文不仅是古代的遗产，更是连接现代人与自然、神性和内在智慧的桥梁。</p>'
                }
            ],
            // 德鲁伊传统
            [
                {
                    title: '德鲁伊的历史角色与社会地位',
                    content: '在古代凯尔特社会（约公元前500年至公元500年），德鲁伊（Druid）是知识的守护者和精神领袖，地位甚至高于国王和战士阶层。根据罗马历史学家凯撒和希腊地理学家斯特拉波的记载，德鲁伊负责主持宗教仪式、裁决法律纠纷、教育贵族子弟，并担任部落的医者、天文学家和顾问。他们是凯尔特社会的"知识阶层"，掌握着神圣的知识和仪式的秘密。德鲁伊的训练极为严格，通常长达二十年，学徒需要记忆大量的诗歌、法律条文、历史传说、草药知识和天文观测。由于凯尔特文化强调口传传统，德鲁伊禁止将神圣知识写成文字，认为书写会削弱记忆和理解的深度。德鲁伊还拥有跨部落的特权，即使在战争期间也可以自由通行，因为他们被视为中立的调解者和神圣的使者。他们主持的仪式包括季节庆典、成年礼、婚礼和葬礼，通过这些仪式维系着社群的凝聚力和与自然的连接。德鲁伊的权威来自于他们对自然法则的深刻理解和与神灵沟通的能力，他们被认为是人类世界与神圣世界之间的桥梁。'
                },
                {
                    title: '生命之轮与八大节日',
                    content: '德鲁伊历法以太阳和月亮的周期为基础，将一年分为八个节日，形成"生命之轮"（Wheel of the Year）。这八个节日包括四个太阳节日（二分二至）和四个火节（凯尔特传统节日）。春分（Ostara，约3月21日）庆祝春天的到来和生命的复苏，昼夜平分象征着光明与黑暗的平衡。贝尔塔恩（Beltane，5月1日）是春季的高峰，庆祝生育力和繁荣，人们点燃篝火、跳舞和举行婚礼。夏至（Litha，约6月21日）是一年中白昼最长的日子，庆祝太阳的力量和丰收的希望。卢格纳萨德（Lughnasadh，8月1日）是第一个收获节，感谢大地的馈赠。秋分（Mabon，约9月21日）庆祝第二次收获，准备迎接冬季。萨温节（Samhain，10月31日）标志着凯尔特新年的开始，是生死两界最薄弱的时刻，人们纪念祖先并预测未来。冬至（Yule，约12月21日）庆祝太阳的重生，黑暗开始消退。因博尔克（Imbolc，2月1日）庆祝春天的第一个迹象，女神布里吉德的节日。每个节日都对应自然的转折点，通过仪式、庆典和冥想，德鲁伊和社群成员与自然的节律保持和谐，庆祝生命的循环和转化。'
                },
                {
                    title: '树木智慧与植物魔法',
                    content: '德鲁伊相信每种树木都有独特的灵性品质和魔法属性，树木是大地的智者和神灵的化身。橡树（Oak）象征力量、耐久和神圣的权威，是德鲁伊最神圣的树木，德鲁伊一词本身可能源于凯尔特语"橡树的智者"。橡树林是德鲁伊举行仪式的神圣场所，槲寄生生长在橡树上被视为天赐的礼物，用金镰刀收割槲寄生是重要的仪式。柳树（Willow）代表直觉、梦境和月亮能量，与水元素和女性力量相关，常用于占卜和疗愈。紫杉树（Yew）连接生死两界，象征永恒和转化，常种植在墓地周围作为守护者。桦树（Birch）象征新的开始和净化，是春天的使者。榛树（Hazel）代表智慧和灵感，榛子被认为包含着诗歌和预言的力量。苹果树（Apple）象征爱、美和不朽，阿瓦隆（Avalon）意为"苹果之岛"，是凯尔特神话中的仙境。德鲁伊通过观察树木的生长周期、与树木冥想交流、使用树木的不同部分（树皮、叶子、果实）进行疗愈和魔法工作，来获取自然的智慧。树木字母表（Ogham）是一种古老的凯尔特文字系统，每个字母对应一种树木，用于占卜和魔法铭文。德鲁伊的植物魔法还包括草药疗愈、花精制作和植物盟友的召唤，这些实践体现了对自然的深刻尊重和与植物王国的灵性连接。'
                },
                {
                    title: '现代德鲁伊复兴运动',
                    content: '18世纪以来，德鲁伊传统经历了浪漫主义复兴，成为现代异教运动的重要分支。1717年，第一个现代德鲁伊组织"古代德鲁伊教团"在伦敦成立，虽然它更多是一个共济会式的兄弟会，但标志着德鲁伊传统的公开复兴。20世纪，德鲁伊运动经历了重大转变，从浪漫主义的历史重建转向真正的灵性实践和生态意识。1964年成立的OBOD（橡树与槲寄生德鲁伊教团）是当今最大的德鲁伊组织之一，提供系统的函授课程，将古代智慧与当代心理学、生态学和灵性实践结合。现代德鲁伊强调三个核心价值：对自然的尊重和保护、对祖先和传统的纪念、对个人灵性成长的追求。他们通过庆祝八大节日、在自然中冥想、学习凯尔特神话和历史、实践草药学和占卜，来重新连接古老的智慧。现代德鲁伊运动也积极参与环境保护和社会正义运动，将灵性实践与现实行动结合。德鲁伊的核心理念——万物有灵、自然的神圣性、生命的循环——在当代生态危机中显得尤为重要，为人类与自然的和谐共存提供了灵性和哲学基础。德鲁伊传统不是对过去的简单复制，而是在尊重传统的基础上创造性地适应当代世界，成为连接古代智慧与现代生活的桥梁。'
                }
            ],
            // 威卡传统
            [
                {
                    title: '威卡的诞生与历史',
                    content: '威卡（Wicca）由英国公务员杰拉德·加德纳（Gerald Gardner，1884-1964）在1950年代创立并公开化，是现代异教运动中最具影响力的分支之一。加德纳声称他在1939年被一个秘密的巫术团体启蒙，继承了古代巫术传统，但学者研究表明，威卡实际上是一个现代综合性宗教体系，融合了多种来源：阿莱斯特·克劳利的仪式魔法、共济会的象征和结构、玛格丽特·默里的"巫术崇拜"理论（虽然后来被证明不准确）、凯尔特和北欧神话、东方神秘主义（如瑜伽和脉轮）以及民间魔法传统。1954年，英国废除了《巫术法案》，加德纳得以公开出版《巫术今日》（Witchcraft Today），标志着威卡的公开化。1960年代，威卡传播到美国，经历了快速发展和多样化。多琳·瓦连特（Doreen Valiente）作为加德纳的女祭司，对威卡的仪式和教义做出了重要贡献，包括创作了著名的《女神的指控》（The Charge of the Goddess）。威卡的发展经历了多个分支：加德纳威卡、亚历山大威卡、狄安尼克威卡（女性主义威卡）、折衷威卡和独行威卡等。尽管形式多样，威卡的核心特征包括对自然的崇拜、二元神性、魔法实践、季节庆典和个人灵性成长的强调。'
                },
                {
                    title: '二元神性与神话',
                    content: '威卡崇拜女神与男神的二元神性，认为神性同时具有女性和男性的面向，两者平等且互补。女神通常以三相女神（Triple Goddess）形象出现：少女（Maiden，新月）代表纯洁、新的开始和潜力；母亲（Mother，满月）代表生育力、滋养和丰盛；老妪（Crone，残月）代表智慧、转化和死亡。这三个面向象征生命的循环和女性生命周期的不同阶段。女神与月亮、大地、水和夜晚相关，是生命的源泉和万物的母亲。男神则通常以有角神（Horned God）的形象出现，代表野性、生育力、狩猎和自然的原始力量。他与太阳、森林、动物和白昼相关，经历着出生、成长、死亡和重生的循环，对应着季节的变化。在威卡神话中，男神在冬至重生，在春天成长，在夏至达到力量的顶峰，在秋天衰老，在萨温节死亡并回归女神的子宫，等待重生。女神与男神的结合（神圣婚姻，Hieros Gamos）象征宇宙的平衡与和谐，是创造力和生命力的源泉。威卡实践者可以选择特定的神话体系（如凯尔特、希腊、埃及）中的神祇作为女神和男神的具体化身，但核心理念是神性的二元性和互补性。这种神学观念挑战了一神教的父权结构，强调女性神性的重要性和性别的平等。'
                },
                {
                    title: '魔法圈与仪式结构',
                    content: '威卡仪式在魔法圈（Magic Circle）中进行，圈内被视为"时间之外的空间"（a place that is not a place, in a time that is not a time），是神圣的、受保护的空间，连接着物质世界和灵性世界。创建魔法圈的过程包括：首先清洁和净化仪式空间（用盐水、熏香或声音），然后用魔杖、剑或手指在空间中画出圆圈，同时观想能量形成保护屏障。接着召唤四元素的守护者（Watchtowers）：东方的气元素（智慧、沟通）、南方的火元素（激情、转化）、西方的水元素（情感、直觉）、北方的土元素（稳定、丰盛）。每个方向都有对应的颜色、工具和象征意义。召唤完成后，实践者邀请女神和男神进入圆圈，通过祈祷、吟唱或"引神降体"（Drawing Down the Moon/Sun）仪式。仪式的核心部分可能包括：庆祝季节节日（Sabbat）或满月（Esbat）、施行魔法工作（咒语、蜡烛魔法、绳结魔法、符文魔法）、冥想和能量提升、分享"蛋糕与酒"（Cakes and Ale，象征女神和男神的祝福）。仪式结束时，实践者感谢并释放四元素守护者和神祇，打开魔法圈，将能量"接地"（grounding）。威卡仪式强调意图、象征和能量的运用，通过仪式行为和专注的意识来实现个人转化和魔法目标。'
                },
                {
                    title: '威卡伦理与生活哲学',
                    content: '威卡的核心伦理是"威卡教条"（Wiccan Rede）："不伤害任何人，做你想做的事"（An it harm none, do what ye will）。这一原则强调个人自由与责任的平衡，鼓励实践者追求自己的意愿和幸福，但前提是不伤害他人（包括自己）。"伤害"的定义是广泛的，包括身体、情感、心理和灵性的伤害。威卡还相信"三倍回报法则"（Law of Threefold Return）或"因果法则"——你释放到宇宙中的能量（无论是正面还是负面）会以三倍的力量返回给你。这一信念促使实践者谨慎使用魔法，考虑行为的长期后果，并培养同理心和责任感。威卡反对"黑魔法"或操控他人意志的魔法，认为这违反了自由意志的原则。威卡的生活哲学还包括：对自然的尊重和保护（许多威卡实践者是环保主义者）、对多样性和包容性的重视（威卡欢迎不同性别、性取向和文化背景的人）、对个人灵性成长的强调（威卡鼓励自我探索和内在转化）、对季节和自然节律的庆祝（通过八大节日和满月仪式）。威卡不是教条主义的宗教，而是一种灵活的、以经验为基础的灵性道路，强调个人与神性的直接连接，而非通过中介或权威。威卡的核心信念是：神性内在于自然和每个人之中，魔法是意识和意图的运用，生命是神圣的循环，死亡不是终点而是转化。'
                }
            ],
            // 荣格心理学
            [
                {
                    title: '集体无意识的发现',
                    content: '卡尔·荣格（1875-1961）在与弗洛伊德决裂后，发展出独特的分析心理学体系。在临床实践中，荣格发现不同文化背景、从未接触过特定神话的患者，其梦境和幻觉中却出现相似的象征符号——蛇、曼陀罗、英雄旅程、大洪水等。这一现象促使他提出集体无意识理论：人类共享一个超越个体经验的心理层面，其中储存着人类进化过程中积累的原型意象（Archetypes）。集体无意识不同于个人无意识（压抑的记忆和情结），它是人类心灵的共同基础，包含着全人类的心理遗产。荣格认为，原型是集体无意识的内容，它们不是具体的形象，而是形成形象的倾向，如同心灵的"空白模板"，在不同文化中以不同的方式被填充。这一理论为理解神话、宗教、艺术和虚拟世界中的符号系统提供了深刻的心理学视角，也解释了为什么某些故事原型（如英雄之旅）能够跨越文化界限引起共鸣。'
                },
                {
                    title: '心理功能与类型理论',
                    content: '荣格提出了心理类型理论，这是MBTI（迈尔斯-布里格斯类型指标）的理论基础。荣格识别出四种基本心理功能：思维（Thinking）、情感（Feeling）、感觉（Sensation）和直觉（Intuition）。思维功能通过逻辑分析理解世界，情感功能通过价值判断评估事物，感觉功能关注具体的感官体验，直觉功能则把握抽象的可能性和潜在意义。每个人都拥有这四种功能，但通常有一种主导功能和一种辅助功能，而对立的功能则相对不发达（称为劣势功能）。此外，荣格还提出了心理能量的两种态度：外倾（Extraversion）和内倾（Introversion）。外倾者的能量流向外部世界，关注客观事物和人际互动；内倾者的能量流向内部世界，关注主观体验和内在反思。这两种态度与四种功能组合，形成了八种心理类型：外倾思维型、内倾思维型、外倾情感型、内倾情感型、外倾感觉型、内倾感觉型、外倾直觉型和内倾直觉型。理解自己的心理类型有助于认识个人的优势和盲点，促进个体化进程的发展。在虚拟社群中，不同心理类型的成员展现出不同的互动模式和角色偏好，这为理解虚拟世界的社会动力学提供了重要视角。'
                },
                {
                    title: '主要原型与象征',
                    content: '荣格识别出多个核心原型，它们在人类的梦境、神话、宗教和艺术中反复显现。自性（Self）是最重要的原型，代表心灵的整体性和完整性，是个体化进程的最终目标，常以曼陀罗、圆形、四方形或神圣人物的形象出现。阴影（Shadow）包含被自我压抑和否认的人格面向，通常是那些与社会规范或自我形象不符的冲动、欲望和特质。阴影常在梦中以同性的威胁性人物出现，面对和整合阴影是个体化的关键步骤。阿尼玛（Anima）是男性心灵中的女性意象，阿尼姆斯（Animus）是女性心灵中的男性意象，它们代表着异性的心理特质，是连接意识与无意识的桥梁。智慧老人（Wise Old Man）和大母神（Great Mother）是指引性原型，前者象征智慧、洞察和精神指引，后者象征滋养、保护和生命的源泉。英雄（Hero）原型代表自我意识的发展和对无意识的征服，英雄之旅是个体化进程的象征性表达。这些原型在虚拟世界的角色扮演、游戏叙事和社群互动中反复显现，玩家通过创造和扮演虚拟角色，无意识地表达和探索这些原型能量。'
                },
                {
                    title: '个体化进程与共时性',
                    content: '个体化（Individuation）是荣格心理学的核心概念，指个体整合意识与无意识、实现心灵完整性的终生过程。这一过程不是自我膨胀，而是自我与自性的对话，是成为真正的自己而非社会期待的面具。个体化包括几个关键阶段：首先是面对阴影，承认和整合被压抑的人格面向；其次是遭遇和整合阿尼玛/阿尼姆斯，发展内在的异性特质；然后是超越人格面具（Persona），不再完全认同社会角色；最终是实现自性，达到心灵的整体性和平衡。这一过程充满挑战和危机，但也带来深刻的心理成长和精神觉醒。虚拟世界中的角色创造与发展可视为个体化进程的象征性表达，玩家通过虚拟化身探索不同的人格面向和可能性。荣格还提出了共时性（Synchronicity）概念，描述有意义的巧合——事件之间没有因果关系，却在意义上相互关联。例如，在思考某个问题时恰好遇到相关的符号或事件。共时性挑战了西方科学的因果律，暗示着心灵与物质世界之间存在着非因果的联系。这一概念为理解占卜、直觉、"命运"和虚拟世界中的"奇迹时刻"提供了心理学框架，也揭示了意识在塑造现实中的潜在作用。'
                }
            ],
            // 拉康精神分析
            [
                {
                    title: '镜像阶段与主体的形成',
                    content: '雅克·拉康（Jacques Lacan，1901-1981）的镜像阶段（Mirror Stage）理论描述了主体形成的关键时刻。在6-18个月时，婴儿通过镜中影像或他人的目光，首次认识到自我作为一个完整、统一的形象。这一时刻充满了喜悦（"啊哈！那就是我！"），但同时也是一种根本性的"误认"（méconnaissance）——镜像提供了一个理想化的、协调的自我形象，掩盖了婴儿实际上运动不协调、依赖他人的现实。主体从此陷入一种永恒的分裂：理想的镜像自我（Ideal-I）与实际的、破碎的身体经验之间的张力。这种分裂是人类主体性的根本特征，永远无法完全克服。镜像阶段标志着想象界（Imaginary）的开始，主体通过认同镜像来构建自我，但这种认同本质上是异化的——自我是通过外部形象建构的，而非内在的真实。拉康的洞见在于揭示了自我认同的虚构性和脆弱性。在虚拟世界中，化身（Avatar）可视为镜像阶段的数字延伸：玩家通过创造和认同虚拟形象来构建理想化的自我，这一过程重复了镜像阶段的误认结构。虚拟化身提供了一个"更完美"的自我形象，但同时也加深了主体与真实身体之间的异化。'
                },
                {
                    title: '三界理论：实在界、想象界、符号界',
                    content: '拉康将心理现实分为三个相互交织的界域，形成了他理论的核心结构。实在界（Real）是最难以把握的概念，它不是"现实"，而是无法被符号化、无法进入语言和意识的创伤性真实。实在界是语言和想象之外的剩余，是主体永远无法完全掌握的"不可能"。它常以创伤、焦虑和"物"（das Ding）的形式闯入主体的经验。想象界（Imaginary）是镜像认同、自恋和幻想的领域，主体在此构建理想化的自我形象和与他人的想象性关系。想象界的特征是二元性（自我与镜像、自我与他人）和完整性的幻觉。符号界（Symbolic）是语言、法律、社会秩序和文化规范的结构，主体通过进入符号界（通过语言习得和俄狄浦斯情结）成为社会主体。符号界由能指（signifier）的链条构成，意义不是固定的，而是在能指之间的差异和替代中产生。主体在三界的交织中构建自我：实在界是无法触及的核心，想象界提供自我形象，符号界赋予社会身份和意义。拉康用博罗米安结（Borromean knot）来表示三界的相互依存：如果其中一个环断裂，整个结构就会瓦解。理解三界对于分析虚拟世界至关重要：虚拟空间是想象界和符号界的混合，而实在界则以技术故障、网络延迟或虚拟暴力的形式闯入。'
                },
                {
                    title: '大他者、欲望与主体性',
                    content: '大他者（Big Other，法语：grand Autre）是拉康理论中的核心概念，代表符号秩序的化身——语言、法律、社会规范和文化的总体结构。大他者不是具体的他人，而是主体赖以存在的符号网络，是"假定知道的主体"（subject supposed to know）。主体通过大他者的目光来认识自己，寻求大他者的承认和认可。拉康著名的论断"欲望是大他者的欲望"（desire is the desire of the Other）有双重含义：一方面，主体的欲望是对大他者承认的欲望（我想要大他者认可我）；另一方面，主体的欲望是对大他者欲望的欲望（我想要大他者想要的东西，或我想知道大他者想要我成为什么）。这揭示了欲望的根本异化：我们的欲望不是真正"我们的"，而是从大他者那里借来的。拉康区分了需要（need）、要求（demand）和欲望（desire）：需要是生物性的，要求是对爱和承认的呼唤，而欲望是要求与需要之间的剩余，是永远无法被满足的缺失。主体性本身就是这种缺失的产物——主体是"被划杠的主体"（$），永远不完整，永远在寻求不可能的完整性。在虚拟社群中，平台规则、社群文化、点赞机制和他人目光共同构成了大他者的网络。用户的行为和自我呈现都是为了获得这个虚拟大他者的承认，而这种承认永远是不充分的，驱动着持续的内容生产和互动。'
                },
                {
                    title: '语言、无意识与症状',
                    content: '拉康最著名的论断之一是"无意识的结构如同语言"（the unconscious is structured like a language）。这一观点彻底改变了精神分析对无意识的理解。对拉康而言，无意识不是弗洛伊德所说的本能冲动的储藏室，而是由能指（signifier）的链条构成的结构。无意识遵循语言的规则：隐喻（metaphor，一个能指替代另一个能指）和转喻（metonymy，能指之间的横向联系）。梦境、症状、失误（parapraxis）和笑话都是无意识的"言说"，需要通过符号分析来解读。症状（symptom）在拉康理论中具有特殊地位：它是实在界闯入符号界的点，是主体无法符号化的创伤的回归。症状是一种"享乐"（jouissance）的形式——一种痛苦的快感，主体既受其折磨又无法放弃。精神分析的目标不是消除症状，而是让主体"穿越幻想"（traversing the fantasy），认识到症状的真相，并与之建立新的关系。拉康还强调了"能指的优先性"：意义不是由所指（signified）决定的，而是在能指链的运动中产生的。主体本身就是一个能指，在大他者的符号网络中寻找自己的位置。语言不是表达思想的工具，而是构成主体和无意识的结构。在虚拟世界中，表情包、梗、缩写和虚拟符号构成了新的能指系统，用户通过这些符号来表达无意识的欲望和焦虑，同时也被这些符号所构成。'
                }
            ],
            // 福柯权力理论
            [
                {
                    title: '知识考古学与话语分析',
                    content: '米歇尔·福柯（Michel Foucault，1926-1984）的考古学方法代表了对传统思想史的根本性挑战。与追溯思想的起源和连续性不同，福柯的考古学分析特定历史时期的"知识型"（episteme）——决定什么可以被言说、被认知、被视为真理的底层结构和规则。知识型不是个人思想的产物，而是匿名的、集体的认知框架，它规定了知识生产的可能性条件。在《词与物》中，福柯识别出西方历史上的三个主要知识型：文艺复兴时期的相似性知识型、古典时期的再现知识型和现代的人类科学知识型。每个知识型都有其独特的认知规则和真理标准，知识型之间的转变是断裂性的，而非渐进的。福柯的话语分析（discourse analysis）关注话语实践——不仅是语言，更是产生对象、主体和真理的社会实践。话语不是中性的描述工具，而是权力的载体和知识的生产机制。通过考古学，福柯揭示了疯癫、性、犯罪、疾病等概念如何在历史中被建构，它们不是自然的、永恒的范畴，而是特定话语实践的产物。例如，"疯癫"在不同时期有不同的定义和处理方式，这些变化反映了知识型和权力关系的转变。福柯的方法论对虚拟世界研究具有重要启示：虚拟空间的规则、分类系统和真理标准构成了一种新的知识型，决定了什么是"正常"的虚拟行为、什么是"有价值"的内容。'
                },
                {
                    title: '规训社会与全景监狱',
                    content: '在《规训与惩罚》（1975）中，福柯分析了现代社会如何从主权权力（通过公开处决展示权力）转变为规训权力（通过监控和训练生产"驯顺的身体"）。规训技术包括：时间表（将时间切分为精确的单位，规定每个时刻的活动）、空间分割（将个体分配到特定的位置，便于监控和管理）、标准化训练（通过重复练习和考核，使身体符合规范）和等级监控（建立观察和评估的层级系统）。这些技术在学校、军队、工厂、医院和监狱中广泛应用，生产出符合社会需要的主体。福柯以边沁（Jeremy Bentham）设计的全景监狱（Panopticon）作为现代权力的隐喻：这是一种圆形建筑，中央有一座监视塔，囚犯被安置在周围的牢房中，可以被监视但看不到监视者。关键在于，囚犯永远不知道自己是否正在被监视，因此必须假定自己始终被监视，从而内化了监控目光，实现自我规训。全景监狱的原则——可见性与不可验证性的结合——成为现代社会的普遍机制。在虚拟世界中，这一机制得到了极致的体现：用户的每一次点击、每一条消息都可能被记录和分析，但用户无法确知谁在何时监视自己。平台的算法、社群的规范和其他用户的目光共同构成了虚拟全景监狱，用户通过自我审查和表演来适应这种监控环境。'
                },
                {
                    title: '权力的微观物理学与生产性',
                    content: '福柯对权力的理解彻底颠覆了传统政治理论。他反对将权力视为自上而下的压迫、某个阶级或机构的占有物，而强调权力是弥散的、关系性的、无处不在的网络。权力不是"拥有"的东西，而是"行使"的关系；权力不仅存在于国家和法律中，更渗透在日常生活的微观实践中——家庭、学校、医院、工作场所的互动都是权力关系的场域。福柯提出"权力的微观物理学"，分析权力如何通过具体的技术和实践作用于身体和行为。更重要的是，福柯强调权力的生产性：权力不仅禁止和压制，更生产知识、话语、快感和主体性。例如，性的话语不是压制性欲，而是生产了关于性的知识、性身份（同性恋、异性恋等范畴）和性主体。权力与知识是不可分割的，形成"权力/知识复合体"（power/knowledge）：知识不是中立的真理，而是权力关系的产物和工具；权力需要知识来运作，知识的生产和传播本身就是权力的行使。福柯的名言"哪里有权力，哪里就有抵抗"揭示了权力关系的动态性：抵抗不是权力的外部，而是权力关系的内在组成部分。在虚拟平台中，权力的微观物理学体现在：算法推荐生产用户的兴趣和身份、点赞机制塑造内容生产的方向、社群规则规训用户的行为、数据分析生产关于用户的知识。虚拟空间不是权力的真空，而是新型权力关系的实验室。'
                },
                {
                    title: '生命政治与治理术',
                    content: '福柯晚期（1970年代末至1980年代初）提出了生命政治（biopolitics）和治理术（governmentality）的概念，分析现代权力的新形式。生命政治描述现代国家如何管理人口的生命过程——出生率、死亡率、健康、卫生、寿命、生育等。权力从古典的主权权力（"让人死或让人活"，通过死刑和战争展示权力）转变为生命权力（"让人活或让人死"，通过医疗、公共卫生和社会政策管理生命）。生命政治的对象不是个体的身体，而是作为整体的人口，通过统计、流行病学和人口学来认识和干预。治理术则是更广泛的概念，指导引导人们行为的技术和理性，包括对自我的治理、对家庭的治理和对国家的治理。现代治理术的特征是通过自由来治理：不是直接命令和禁止，而是塑造选择的环境和框架，让个体"自由地"做出符合治理目标的选择。新自由主义治理术将个体塑造为"企业家式的自我"，要求个体对自己的健康、教育、职业和生活负责，将社会风险个体化。数字时代的生命政治呈现出新的形式：数据监控、算法治理、健康追踪、社交媒体的情感管理都是生命权力的新技术。虚拟平台通过收集和分析用户数据，不仅管理用户的在线行为，更试图预测和塑造用户的欲望、情感和生活方式。用户被鼓励"自由地"分享、表达和消费，但这种自由本身就是治理的机制。福柯的生命政治理论为批判性地理解数字资本主义和平台权力提供了重要的理论工具。'
                }
            ],
            // 海德平衡理论
            [
                {
                    title: 'P-O-X三元关系模型',
                    content: '弗里茨·海德（Fritz Heider，1896-1988）的平衡理论（Balance Theory）是社会心理学中认知一致性理论的重要代表，于1958年在《人际关系心理学》中系统提出。该理论以三元关系为基础，包括三个要素：P（Person，个人，即认知主体）、O（Other，他人，即社会关系中的另一方）、X（对象或议题，可以是物品、观点、第三人或事件）。这三个要素之间存在两种类型的关系：情感关系（喜欢/不喜欢，用L表示）和单元关系（属于/拥有/相关，用U表示）。海德认为，当三者之间的态度关系达到平衡状态时，个体感到认知和谐、心理舒适；当关系失衡时，个体会体验到心理紧张和不适，驱动其改变态度或重新评估关系以恢复平衡。平衡的判断规则是：将三条关系的符号相乘，如果结果为正（+），则系统平衡；如果结果为负（-），则系统失衡。例如，P喜欢O（+），O喜欢X（+），P也喜欢X（+），三者相乘为正，系统平衡。但如果P喜欢O（+），O喜欢X（+），P却不喜欢X（-），三者相乘为负，系统失衡，P会感到认知不协调。海德的理论揭示了人际关系和态度形成的基本动力机制，为理解社会认知的结构化提供了简洁而深刻的模型。'
                },
                {
                    title: '平衡与失衡的动力学',
                    content: '海德识别出四种基本的三元关系配置，其中两种是平衡的，两种是失衡的。平衡状态包括：（1）正向平衡——三个正关系（P喜欢O，O喜欢X，P喜欢X）或一正两负（P喜欢O，O不喜欢X，P也不喜欢X），这种配置下个体感到和谐，"我的朋友的朋友是我的朋友"或"我的朋友的敌人是我的敌人"；（2）负向平衡——三个负关系（P不喜欢O，O不喜欢X，P喜欢X），虽然关系是负面的，但结构上是平衡的。失衡状态包括：（1）两正一负（P喜欢O，O喜欢X，P不喜欢X），这是最常见的失衡情境，"我的朋友喜欢我讨厌的东西"；（2）一正两负（P喜欢O，O不喜欢X，P喜欢X），"我的朋友讨厌我喜欢的东西"。失衡状态会引发认知不适和心理紧张，驱动个体采取行动恢复平衡。恢复平衡的策略包括：改变对O的态度（重新评估友谊，"也许我们不是那么亲密"）、改变对X的态度（"也许X没有我想的那么糟"）、改变对O-X关系的认知（"也许O并不真的喜欢X"）、分割认知（"我们在这个问题上不同意，但在其他方面很合拍"）或寻求新信息来合理化失衡（"O喜欢X是有特殊原因的"）。平衡理论的核心洞见是：人类认知系统倾向于简单、一致和和谐的结构，复杂和矛盾的关系会引发心理压力。'
                },
                {
                    title: '虚拟社群中的平衡动力学',
                    content: '海德平衡理论在虚拟社群研究中具有重要的应用价值，因为虚拟空间充满了复杂的三元关系：用户-好友-观点、用户-群组-内容、用户-意见领袖-议题等。在虚拟社群中，成员通过调整对他人和议题的态度来维持心理平衡，这一机制解释了多种社会现象。例如，当好友在社交媒体上支持某个有争议的政治观点时，个体面临失衡：如果我喜欢这个朋友（+），朋友支持这个观点（+），但我反对这个观点（-），系统失衡。个体可能采取的策略包括：改变对观点的态度（"也许这个观点有道理"），这导致意见趋同；改变对朋友的态度（"我们不再是朋友"），这导致社交网络的分裂和派系形成；或者选择性忽略和回避（"我不看他关于政治的帖子"），这导致信息茧房的形成。平衡理论还解释了虚拟社群中的"回音室效应"：人们倾向于与观点相似的人建立联系（正向平衡），排斥观点不同的人（避免失衡），导致社群内部意见的同质化和极化。此外，平衡理论揭示了意见领袖和网红的影响机制：当用户喜欢某个意见领袖（+），意见领袖推荐某个产品或观点（+），用户倾向于也喜欢该产品或观点（+）以维持平衡，这是虚拟营销和意见传播的心理基础。'
                },
                {
                    title: '社会认知的结构化与应用',
                    content: '海德平衡理论揭示了社会认知的深层结构性特征：人类心智倾向于构建简单、一致、和谐的认知图式，复杂和矛盾被视为需要解决的问题。这种倾向既有积极作用，也有消极后果。积极方面，平衡倾向促进了社群凝聚力和社会协调：共同的敌人可以团结群体（"敌人的敌人是朋友"），共同的价值观可以巩固友谊。平衡机制也是社会化和文化传承的基础：儿童通过认同父母和老师（+），接受他们所推崇的价值观和行为规范（+），形成社会认同。消极方面，过度追求平衡可能导致认知僵化、群体思维和社会极化。在虚拟环境中，算法推荐系统往往强化平衡倾向：推荐与用户观点一致的内容和相似的用户，避免引发认知失衡，这虽然提高了用户满意度，却加剧了信息茧房和社会分裂。理解平衡机制对于设计更健康的虚拟社交环境至关重要：可以通过引入"建设性的失衡"（如推荐不同但相关的观点）、鼓励观点多样性、培养认知复杂性（接受矛盾和模糊）来对抗过度的平衡追求。海德理论也启发了后续的认知一致性理论，如费斯廷格的认知失调理论和奥斯古德的一致性理论，共同构成了社会心理学的重要理论基础。在虚拟民族志研究中，平衡理论提供了分析社群动力学、派系形成、意见传播和冲突解决的有力工具。'
                }
            ],
            // 虚拟民族志
            [
                {
                    title: '方法论基础与理论渊源',
                    content: '虚拟民族志（Virtual Ethnography）或称网络民族志（Netnography）、数字民族志（Digital Ethnography），是将传统人类学的田野调查方法应用于网络空间的研究范式。这一方法论的发展始于1990年代互联网的普及，早期研究者如克里斯汀·海因（Christine Hine）、罗伯特·科兹内茨（Robert Kozinets）等开拓了这一领域。虚拟民族志继承了马林诺夫斯基（Bronisław Malinowski）以来的民族志传统——通过长期的参与观察、深度访谈和文化沉浸来理解特定社群的生活世界和意义系统。但虚拟民族志也面临独特的挑战：虚拟空间的边界是流动的，"田野"不再是地理意义上的地点，而是由技术、社会关系和文化实践构成的网络；研究者的"在场"是通过屏幕和化身中介的，身体性和感官经验被重新配置；虚拟社群的成员可能分布在全球各地，跨越时区和文化背景。虚拟民族志强调情境性理解和"厚描"（thick description），而非抽象的数据分析和量化统计。研究者以"数字原住民"的身份沉浸于虚拟社群，通过长期互动理解成员的文化实践、价值观、规范、仪式和意义建构。这一方法论对于研究元宇宙、虚拟现实社群、在线游戏社区、社交媒体文化等具有不可替代的价值，因为它能够捕捉到量化方法无法触及的文化深度和主观经验。'
                },
                {
                    title: '在线参与式观察的实践',
                    content: '参与观察是虚拟民族志的核心方法，要求研究者在虚拟世界中创建化身（Avatar），参与社群的日常活动，建立关系网络，成为社群的"内部人"。这一过程包括几个阶段：首先是进入田野，研究者需要选择研究的虚拟社群、创建合适的化身、学习平台的技术操作和社群的文化规范。初期阶段，研究者通常处于边缘位置，需要通过观察和试探性互动来理解社群的运作逻辑。其次是建立关系，研究者通过参与活动、提供帮助、分享经验来获得成员的信任和接纳。这一过程可能需要数月甚至数年，取决于社群的开放程度和研究者的社交技能。第三是深度参与，研究者不仅观察，更积极参与社群的核心活动——仪式、庆典、冲突、决策等，体验成员的情感和视角。观察内容包括：互动模式（谁与谁互动、如何互动、互动的频率和质量）、仪式行为（定期活动、庆典、成年礼等）、冲突解决机制（如何处理分歧和违规行为）、文化符号的使用（语言、表情、服装、空间布置）、权力关系（谁有影响力、如何获得和行使权力）、身份表演（成员如何呈现自我、如何被他人认知）。研究者需在参与和观察之间保持微妙的平衡：过度参与可能失去分析性距离和客观性，过度疏离则无法理解成员的主观世界。这种"参与式客观性"是民族志方法的核心张力，也是其独特价值所在。'
                },
                {
                    title: '数字档案与多模态分析',
                    content: '虚拟空间的一个独特优势是互动留下大量可追溯的数字痕迹——聊天记录、论坛帖子、博客文章、截图、视频、音频、用户生成内容等。这些材料构成了丰富的档案资源，为研究者提供了传统田野调查难以获得的详细记录。数字档案的分析包括多个层面：文本分析关注语言的使用、话语模式、叙事结构和修辞策略，揭示成员如何通过语言构建身份、关系和意义。符号学分析解读视觉符号、表情包、化身设计、空间布置等非语言元素，理解符号系统的文化逻辑。内容编码通过系统化的分类和计数，识别主题、模式和趋势。网络分析绘制社交关系的结构，识别核心成员、派系和信息流动。时间序列分析追踪社群的演变、事件的发展和文化的变迁。虚拟民族志的分析是多模态的，整合文本、图像、声音、空间和互动数据，构建对虚拟文化的全面理解。研究者还需要注意数字档案的局限性：并非所有互动都被记录（如私聊、语音交流），记录本身可能影响行为（自我审查），档案的保存和访问受到技术和政策的限制。因此，数字档案分析需要与参与观察和访谈相结合，形成方法论的三角验证（triangulation），提高研究的信度和效度。'
                },
                {
                    title: '伦理挑战与研究伦理',
                    content: '虚拟民族志面临独特而复杂的伦理挑战，这些挑战源于虚拟空间的特殊性质和研究方法的侵入性。首先是公共与私人空间的界定：虚拟社群的互动发生在技术上"公开"的平台上，但成员可能将其视为"私人"或"半私人"的空间。研究者是否有权在未经许可的情况下观察和记录这些互动？不同的伦理立场给出不同的答案：有些研究者认为公开平台的内容是"公共数据"，可以自由使用；另一些研究者则主张尊重成员的隐私期待，即使在技术上可访问。其次是知情同意的问题：传统民族志要求研究者告知参与者研究目的并获得同意，但在虚拟环境中，这一要求面临实践困难——社群成员可能数以千计，流动性高，告知本身可能改变社群的自然状态（霍桑效应）。研究者需要在透明度和研究有效性之间寻求平衡，常见的做法是告知社群管理者或核心成员，在研究报告中使用化名和模糊化处理。第三是匿名性和保密性：虚拟空间的数字痕迹是持久的、可搜索的，即使研究者使用化名，独特的引语或细节仍可能被追溯到具体个人。研究者需要采取额外措施保护参与者的身份，如改写引语、省略识别性细节、获得敏感内容的明确许可。第四是权力关系和剥削风险：研究者从社群中提取数据和知识，但社群成员通常不会从研究中直接受益，这种不对等关系引发了剥削和殖民主义的批评。参与式行动研究（Participatory Action Research）试图通过让社群成员参与研究设计和成果分享来解决这一问题。虚拟民族志研究者需要遵循"不伤害"原则，尊重参与者的自主性和尊严，在学术诚信、参与者权益和研究价值之间寻求伦理平衡。'
                }
            ],
            // 炼金术
            [
                {
                    title: '炼金术的起源与历史',
                    content: '炼金术（Alchemy）起源于公元前后的希腊化埃及，特别是亚历山大城，融合了希腊哲学、埃及神秘主义、犹太卡巴拉和早期化学实践。"炼金术"一词源于阿拉伯语"al-kīmiyā"，可能来自古埃及语"kēme"（黑土，指尼罗河肥沃的土壤）或希腊语"chymeia"（金属熔炼）。早期炼金术文献包括《翡翠石板》（Emerald Tablet），传说由赫尔墨斯·特里斯墨吉斯忒斯（Hermes Trismegistus，三倍伟大的赫尔墨斯）所著，其中的名言"如其在上，如其在下"（As above, so below）成为炼金术的核心原则，揭示了宏观宇宙与微观宇宙的对应关系。炼金术在中世纪通过阿拉伯世界传入欧洲，阿拉伯炼金术士如贾比尔·伊本·哈扬（Jabir ibn Hayyan，拉丁化为Geber）和拉齐（Al-Razi）发展了系统的实验方法和理论框架。欧洲炼金术在文艺复兴时期达到顶峰，帕拉塞尔苏斯（Paracelsus）将炼金术与医学结合，提出"医疗炼金术"（Iatrochemistry）。炼金术士追求三大目标：制造贤者之石（Philosopher\'s Stone，能将贱金属转化为黄金的神秘物质）、发现万能药（Panacea，治愈一切疾病的灵药）和创造人造生命（Homunculus）。然而，炼金术的真正意义超越了物质层面，它是一门关于转化的艺术——物质的转化象征着灵魂的净化和精神的升华。'
                },
                {
                    title: '大作的四个阶段',
                    content: '炼金术的核心实践被称为"大作"（Magnum Opus）或"伟大工作"（Great Work），描述将原始物质转化为贤者之石的过程，同时象征灵魂从无知到觉悟的旅程。大作通常分为四个阶段，对应四种颜色和四种元素。第一阶段是黑化（Nigredo，黑色阶段），象征死亡、分解和混沌。在实验室中，这是物质的煅烧和腐化；在灵性层面，这是自我的瓦解、阴影的面对和旧有身份的死亡。黑化是最痛苦的阶段，但也是必要的净化过程，对应荣格心理学中的"黑夜"和抑郁状态。第二阶段是白化（Albedo，白色阶段），象征净化、洗涤和月亮的能量。物质经过蒸馏和升华，变得纯净；灵魂经过反思和内省，获得清明。白化代表阴性原则（月亮、水、直觉）的显现，对应荣格的阿尼玛整合。第三阶段是黄化（Citrinitas，黄色阶段），在某些传统中被省略或合并到其他阶段，象征黎明、太阳的初升和智慧的觉醒。第四阶段是红化（Rubedo，红色阶段），象征完成、统一和太阳的能量。物质达到完美状态，成为贤者之石；灵魂实现了对立面的结合（阴阳、意识与无意识、灵与肉），达到整体性和神性。红化对应荣格的自性实现和个体化的完成。大作的过程是循环的，每一次循环都将物质和灵魂提升到更高的层次。'
                },
                {
                    title: '炼金术符号与象征体系',
                    content: '炼金术发展出一套复杂而丰富的符号语言，用于记录实验过程、传达秘密知识和表达灵性洞见。这些符号既是化学物质的代号，也是心理和灵性状态的隐喻。七大行星金属是炼金术的基础：金（太阳☉）代表完美、神性和自性；银（月亮☽）代表纯洁、直觉和阴性原则；水银（水星☿）代表流动性、转化和中介；铜（金星♀）代表美、爱和欲望；铁（火星♂）代表力量、意志和战斗；锡（木星♃）代表扩展、智慧和繁荣；铅（土星♄）代表沉重、限制和时间。炼金术的核心符号包括：乌洛波洛斯（Ouroboros，衔尾蛇）象征循环、永恒和自我更新；赫尔墨斯之杖（Caduceus，双蛇杖）象征对立面的平衡和转化的力量；炼金术婚礼（Chymical Wedding）描绘国王（太阳、硫磺、阳性）与王后（月亮、水银、阴性）的结合，象征对立面的统一；绿狮吞噬太阳象征原始物质对完美的渴望；凤凰从灰烬中重生象征死亡与重生的循环。炼金术文献常使用隐晦的语言和寓言，如"我们的水不是普通的水"、"杀死活的，复活死的"，这些谜语既保护秘密不被外人知晓，也迫使学徒通过冥想和直觉来理解深层意义。炼金术符号深刻影响了塔罗牌、占星术和现代神秘学的象征体系。'
                },
                {
                    title: '荣格与炼金术心理学',
                    content: '卡尔·荣格在晚年深入研究炼金术，认为炼金术是西方文化中集体无意识的投射，是个体化进程的象征性表达。荣格在《心理学与炼金术》（1944）和《神秘结合》（1955-1956）中系统阐述了炼金术的心理学意义。荣格发现，炼金术士的实验室工作实际上是一种"积极想象"（active imagination）的形式，他们将内在的心理过程投射到物质上，通过操作物质来转化心灵。炼金术的四个阶段对应个体化的心理过程：黑化是面对阴影和无意识的黑暗面，白化是阿尼玛/阿尼姆斯的整合，黄化是智慧的觉醒，红化是自性的实现。贤者之石象征自性（Self），是心灵的完整性和神性的内在体验。炼金术婚礼象征意识与无意识、理性与直觉、阳性与阴性的结合，这是个体化的核心任务。荣格还注意到炼金术中的"救赎者-被救赎者"（Salvator-Salvandus）主题：炼金术士试图"救赎"被囚禁在物质中的灵性，但在这一过程中，炼金术士自己也被转化和救赎。这一悖论揭示了心理治疗的本质：治疗者与被治疗者在治疗过程中相互转化。荣格的炼金术研究为理解宗教、神话和心理治疗提供了深刻的象征框架，也为现代人重新连接古老智慧开辟了道路。在虚拟世界中，化身的创造和发展可视为一种数字炼金术：玩家通过虚拟形象的转化来探索和实现内在的心理潜能。'
                }
            ],
            // 占星术
            [
                {
                    title: '占星术的起源与发展',
                    content: '占星术（Astrology）是人类最古老的知识体系之一，起源于公元前3000年左右的美索不达米亚（今伊拉克地区）。苏美尔人和巴比伦人通过长期观察天象，发现天体运动与地上事件（如季节变化、洪水、战争）之间的关联，发展出最早的占星系统。巴比伦占星术主要用于预测国家大事和王室命运，被称为"司法占星术"（Judicial Astrology）。占星术通过希腊化时期传入希腊，与希腊哲学（特别是柏拉图和亚里士多德的宇宙观）结合，发展出更系统的理论框架。托勒密（Claudius Ptolemy）在公元2世纪撰写的《占星四书》（Tetrabiblos）成为西方占星术的经典文献，确立了黄道十二宫、行星尊贵、相位理论等核心概念。占星术在中世纪和文艺复兴时期被视为合法的学问，与天文学、医学和哲学密切相关。然而，17世纪科学革命后，占星术与天文学分道扬镳，被主流科学排斥。20世纪，占星术经历了复兴，特别是心理占星术的兴起，将占星术从预测命运的工具转变为自我认知和心理成长的方法。现代占星术融合了荣格心理学、人本主义心理学和灵性传统，强调自由意志、个人成长和意识的觉醒。占星术的核心信念是"如其在上，如其在下"——天体的运动反映了宇宙的能量模式，这些模式在不同层面（宇宙、社会、个人）以不同方式显现。'
                },
                {
                    title: '十二星座与四元素',
                    content: '黄道十二宫（Zodiac）是占星术的基础，将太阳在天空中的运行轨迹（黄道）分为十二个30度的区域，每个区域对应一个星座。十二星座按照四元素（火、土、风、水）和三模式（基本、固定、变动）分类，形成复杂的象征网络。火元素星座（白羊座、狮子座、射手座）代表热情、行动、直觉和创造力，是外向的、阳性的能量，驱动着冒险、领导和自我表达。土元素星座（金牛座、处女座、摩羯座）代表稳定、实际、感官和物质，关注现实、安全和具体成果，是建设者和管理者。风元素星座（双子座、天秤座、水瓶座）代表思维、沟通、社交和理念，是智力的、客观的能量，追求知识、关系和社会理想。水元素星座（巨蟹座、天蝎座、双鱼座）代表情感、直觉、深度和灵性，是内向的、阴性的能量，关注情感连接、心理深度和超越性体验。三模式描述能量的表达方式：基本星座（白羊、巨蟹、天秤、摩羯）开启季节，代表主动、开创和领导；固定星座（金牛、狮子、天蝎、水瓶）稳定季节，代表坚持、专注和抵抗变化；变动星座（双子、处女、射手、双鱼）结束季节，代表适应、灵活和转化。每个星座都有其守护行星、象征符号和神话原型，如白羊座由火星守护，象征战士和先锋；金牛座由金星守护，象征感官享受和物质安全；双子座由水星守护，象征沟通和多样性。理解星座不是简单的性格分类，而是理解能量原型和心理模式的工具。'
                },
                {
                    title: '行星、宫位与相位',
                    content: '占星术使用十大天体（太阳、月亮、水星、金星、火星、木星、土星、天王星、海王星、冥王星）作为能量的载体，每个行星代表人格的不同面向和生命的不同领域。太阳代表核心自我、意识和生命力；月亮代表情感、需求和潜意识；水星代表思维、沟通和学习；金星代表爱、美和价值观；火星代表行动、欲望和意志；木星代表扩展、智慧和信念；土星代表限制、责任和成熟；天王星代表革新、自由和觉醒；海王星代表梦想、灵性和幻象；冥王星代表转化、权力和深层心理。本命盘（Natal Chart）是个人出生时刻天空的快照，显示行星在黄道十二宫中的位置。十二宫位（Houses）将个人经验分为十二个生活领域：第一宫（自我与外表）、第二宫（财富与价值）、第三宫（沟通与学习）、第四宫（家庭与根基）、第五宫（创造与爱情）、第六宫（工作与健康）、第七宫（伙伴关系）、第八宫（转化与共享资源）、第九宫（哲学与远行）、第十宫（事业与社会地位）、第十一宫（友谊与理想）、第十二宫（潜意识与灵性）。相位（Aspects）描述行星之间的角度关系，揭示能量如何互动：合相（0度，融合）、六分相（60度，和谐机会）、四分相（90度，紧张挑战）、三分相（120度，流畅天赋）、对分相（180度，对立平衡）。解读本命盘需要综合考虑行星、星座、宫位和相位，理解它们如何共同塑造个人的心理结构、生命主题和成长路径。'
                },
                {
                    title: '行运、推运与时间占星',
                    content: '占星术不仅分析出生时刻的能量配置（本命盘），还研究时间的流动如何激活和转化这些能量。行运（Transits）是当前天空中行星的实时位置与本命盘行星的互动，揭示当下的能量氛围和生命主题。例如，土星回归（Saturn Return，土星回到出生时的位置，约29.5年一次）标志着成熟和责任的重大考验；冥王星行运常带来深刻的转化和权力斗争。推运（Progressions）是一种象征性的时间系统，最常用的是次限推运（Secondary Progressions），将出生后每一天对应生命中的一年，揭示内在的心理发展和成熟过程。太阳弧推运（Solar Arc Directions）将所有行星以太阳的速度推进，提供另一种时间视角。择时占星术（Electional Astrology）用于选择开始重要事务的最佳时机，如婚礼、开业、签约等。卜卦占星术（Horary Astrology）通过提问时刻的星盘回答具体问题。世俗占星术（Mundane Astrology）研究国家、社会和集体事件的占星周期，如土木合相（Jupiter-Saturn conjunction，约20年一次）标志着社会结构的转变。现代心理占星术强调占星术不是宿命论，而是揭示潜能和挑战的地图，个人拥有自由意志来选择如何回应这些能量。占星术的价值在于提供自我认知的框架、理解生命周期的工具和与宇宙节律和谐共振的智慧。在虚拟世界中，占星术可以帮助理解不同性格类型的互动模式、社群的能量动力学和集体事件的周期性规律。'
                }
            ],
            // 卡巴拉
            [
                {
                    title: '卡巴拉的起源与传统',
                    content: '卡巴拉（Kabbalah，希伯来语קַבָּלָה，意为"接受"或"传统"）是犹太神秘主义的核心，起源于公元1世纪至2世纪的巴勒斯坦和巴比伦，但其根源可追溯到更古老的犹太秘传传统。早期卡巴拉文献包括《创造之书》（Sefer Yetzirah，约3-6世纪）和《光辉之书》（Sefer ha-Zohar，13世纪在西班牙出现，传统上归于2世纪的拉比西蒙·本·约海）。卡巴拉在中世纪的西班牙和普罗旺斯达到系统化的高峰，形成了以生命之树（Etz Chaim）为核心的象征体系。16世纪，以撒·卢里亚（Isaac Luria）在萨法德（今以色列）发展出卢里亚卡巴拉，引入了"收缩"（Tzimtzum）、"破碎"（Shevirat ha-Kelim）和"修复"（Tikkun）等革命性概念，深刻影响了后世的犹太神秘主义和哈西德运动。卡巴拉的核心关切是神性的本质、宇宙的创造、恶的起源和灵魂的救赎。卡巴拉认为，至高的神（Ein Sof，无限者）是完全超越的、不可知的、无形无相的，但通过"流溢"（Emanation）过程，神性逐渐显现为十个质点（Sefirot），形成生命之树的结构。卡巴拉不仅是理论体系，更是实践传统，包括冥想、祈祷、字母组合（Temurah）、数字学（Gematria）和神圣名字的吟诵，旨在实现与神性的结合（Devekut）和宇宙的修复（Tikkun Olam）。19世纪末，卡巴拉通过黄金黎明会（Hermetic Order of the Golden Dawn）等神秘学组织传入西方，与基督教神秘主义、炼金术和仪式魔法结合，形成赫尔墨斯卡巴拉（Hermetic Kabbalah），深刻影响了现代神秘学、塔罗牌和新时代运动。'
                },
                {
                    title: '生命之树与十个质点',
                    content: '生命之树（Etz Chaim）是卡巴拉最重要的象征图式，描绘神性流溢的过程和宇宙的结构。生命之树由十个质点（Sefirot，单数Sefirah）和二十二条路径组成，质点代表神性的不同面向和宇宙的不同层次，路径代表质点之间的连接和能量的流动。十个质点从���到下排列为三个三角形（三元组）加一个基础：第一个三元组是超越三角（Supernal Triad）：Keter（王冠，至高意志）、Chokmah（智慧，阳性原则）、Binah（理解，阴性原则）。这三个质点最接近Ein Sof，代表神性的原初显现，超越人类理解。第二个三元组是伦理三角：Chesed（仁慈，扩展）、Geburah（严厉，限制）、Tiferet（美，平衡）。这三个质点代表道德和情感的力量，Tiferet作为中心，调和Chesed的慈悲与Geburah的正义。第三个三元组是行动三角：Netzach（胜利，持久）、Hod（荣耀，智力）、Yesod（基础，潜意识）。这三个质点代表心理和能量的运作，Yesod作为中介，连接上层质点与物质世界。第十个质点是Malkuth（王国，物质世界），代表神性流溢的最终显现，是我们生活的物质现实。生命之树还分为三根柱子：右柱（仁慈之柱，阳性）包括Chokmah、Chesed、Netzach；左柱（严厉之柱，阴性）包括Binah、Geburah、Hod；中柱（平衡之柱）包括Keter、Tiferet、Yesod、Malkuth。三根柱子象征宇宙的极性和平衡原则。每个质点都有对应的神圣名字、天使、行星、颜色、象征和灵性品质，形成复杂的对应体系。'
                },
                {
                    title: '四个世界与神性流溢',
                    content: '卡巴拉将现实分为四个世界（Four Worlds），描述神性从无限到有限、从灵性到物质的逐渐凝结过程。每个世界都包含完整的生命之树，但振动频率和显现程度不同。第一个世界是Atziluth（流溢界或原型界），最接近Ein Sof，是纯粹神性的世界，对应火元素和塔罗的权杖。在这个世界，质点以最纯粹的形式存在，是原型和神圣名字的领域。第二个世界是Beriah（创造界），是大天使和纯粹理念的世界，对应水元素和塔罗的圣杯。在这个世界，神性开始分化，但仍保持灵性的纯净。第三个世界是Yetzirah（形成界），是天使、灵魂和心理形式的世界，对应风元素和塔罗的宝剑。在这个世界，能量开始具体化，形成可感知的形式和情感。第四个世界是Assiah（行动界或物质界），是我们生活的物质现实，对应土元素和塔罗的星币。在这个世界，神性以最稠密的形式显现，但也最容易被遮蔽和遗忘。四个世界的理论揭示了一个核心洞见：物质世界不是与灵性世界分离的，而是神性流溢的最终显现，每个层次都包含着神圣的火花。人类的灵魂也分为五个层次，对应不同的世界：Nefesh（动物灵魂，Assiah）、Ruach（理性灵魂，Yetzirah）、Neshamah（高等灵魂，Beriah）、Chayah（生命力，Atziluth）、Yechidah（神性火花，Ein Sof）。灵性实践的目标是提升意识，从低层次的灵魂上升到高层次，最终实现与神性的结合。'
                },
                {
                    title: '路径、字母与卡巴拉实践',
                    content: '生命之树的二十二条路径连接十个质点，对应希伯来字母的二十二个字母，每条路径代表一种意识状态、一种转化过程和一张塔罗大阿卡纳牌。希伯来字母在卡巴拉中不仅是语言符号，更是神圣的力量和创造的工具。《创造之书》描述神通过二十二个字母创造宇宙，每个字母都有数字值、象征意义和魔法属性。例如，Aleph（א，数值1）代表开始、气息和神性的统一；Bet（ב，数值2）代表二元性、容器和创造；Shin（ש，数值300）代表火、转化和神圣之灵。卡巴拉实践包括多种方法：Gematria（数字学）通过计算希伯来词语的数字值来揭示隐藏的联系，例如"爱"（Ahavah，אהבה）和"一"（Echad，אחד）的数值都是13，揭示爱与神性统一的关系。Notarikon（首字母缩写）将词语的每个字母视为另一个词的首字母，揭示深层意义。Temurah（字母置换）通过系统地替换字母来发现新的意义。冥想实践包括观想生命之树、吟诵神圣名字（如四字神名YHVH）、专注于特定质点的品质和颜色。路径工作（Pathworking）是一种引导式冥想，想象自己沿着生命之树的路径旅行，体验不同质点的能量和智慧。卡巴拉的终极目标是Tikkun（修复）——修复破碎的宇宙和分离的灵魂，恢复与神性的统一。这一目标不仅是个人的灵性追求，也是集体的责任，每个善行、每次祈祷、每个正念时刻都为宇宙的修复做出贡献。在现代神秘学中，卡巴拉成为整合不同传统（占星术、塔罗、炼金术、魔法）的统一框架，生命之树被视为意识地图和灵性成长的路径。'
                }
            ]
        ];

        let currentKnowledgeIndex = 0;
        let currentPageIndex = 0;

        function openKnowledgeDetail(index) {
            currentKnowledgeIndex = index;
            currentPageIndex = 0;
            const knowledge = knowledgeData[index];
            
            // 创建或获取模态框
            let modal = document.getElementById('knowledgeDetailModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'knowledgeDetailModal';
                modal.className = 'knowledge-detail-modal';
                modal.onclick = (e) => {
                    if (e.target === modal) {
                        closeKnowledgeDetail();
                    }
                };
                document.body.appendChild(modal);
            }

            // 构建详情内容
            const keyPointsHTML = knowledge.keyPoints.map(point => `<li>${point}</li>`).join('');
            
            modal.innerHTML = `
                <div class="magic-book-container">
                    <button class="knowledge-close-btn" onclick="closeKnowledgeDetail()">×</button>
                    
                    <!-- 魔法阵背景装饰 -->
                    <div class="magic-circle-bg"></div>
                    
                    <!-- 翻开的书本 -->
                    <div class="open-book">
                        <!-- 左页 -->
                        <div class="book-page left-page">
                            <div class="page-decoration top-left"></div>
                            <div class="page-decoration bottom-right"></div>
                            <div class="page-content">
                                <h3 class="book-title">${knowledge.title}</h3>
                                <div class="book-subtitle">${knowledge.subtitle}</div>
                                <div class="divider-line"></div>
                                <div class="book-description">${knowledge.description}</div>
                            </div>
                            <div class="page-number">1</div>
                        </div>
                        
                        <!-- 右页 -->
                        <div class="book-page right-page">
                            <div class="page-decoration top-right"></div>
                            <div class="page-decoration bottom-left"></div>
                            <div class="page-content">
                                <h4 class="section-title">核心要素</h4>
                                <ul class="key-points-list">${keyPointsHTML}</ul>
                                <div class="page-hint">点击右侧翻页探索更多内容 →</div>
                            </div>
                            <div class="page-number">2</div>
                        </div>
                    </div>
                    
                    <!-- 翻页按钮 -->
                    <button class="page-turn-btn prev-btn" onclick="turnPage(-1)" style="opacity: 0.3; cursor: not-allowed;">
                        <span>◀</span>
                    </button>
                    <button class="page-turn-btn next-btn" onclick="turnPage(1)">
                        <span>▶</span>
                    </button>
                    
                    <!-- 页码指示器 -->
                    <div class="page-indicator">
                        <span class="current-page-num">1-2</span>
                        <span class="total-pages">/ ${knowledgeExtendedContent[index].length + 1}</span>
                    </div>
                </div>
            `;

            modal.classList.add('show');
            document.documentElement.style.overflow = 'hidden';
        }

        // 翻页功能
        function turnPage(direction) {
            const extendedPages = knowledgeExtendedContent[currentKnowledgeIndex];
            // 修复：计算总页面对数 = 1个初始页 + (扩展页数/2)向上取整
            const totalPagePairs = 1 + Math.ceil(extendedPages.length / 2);
            
            currentPageIndex += direction;
            
            // 边界检查
            if (currentPageIndex < 0) {
                currentPageIndex = 0;
                return;
            }
            if (currentPageIndex >= totalPagePairs) {
                currentPageIndex = totalPagePairs - 1;
                return;
            }
            
            const knowledge = knowledgeData[currentKnowledgeIndex];
            const leftPage = document.querySelector('.left-page .page-content');
            const rightPage = document.querySelector('.right-page .page-content');
            const leftPageNum = document.querySelector('.left-page .page-number');
            const rightPageNum = document.querySelector('.right-page .page-number');
            const pageIndicator = document.querySelector('.current-page-num');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            
            // 添加翻页动画
            document.querySelector('.open-book').classList.add('page-turning');
            
            setTimeout(() => {
                if (currentPageIndex === 0) {
                    // 第一页（初始页）
                    const keyPointsHTML = knowledge.keyPoints.map(point => `<li>${point}</li>`).join('');
                    leftPage.innerHTML = `
                        <h3 class="book-title">${knowledge.title}</h3>
                        <div class="book-subtitle">${knowledge.subtitle}</div>
                        <div class="divider-line"></div>
                        <div class="book-description">${knowledge.description}</div>
                    `;
                    rightPage.innerHTML = `
                        <h4 class="section-title">核心要素</h4>
                        <ul class="key-points-list">${keyPointsHTML}</ul>
                        <div class="page-hint">点击右侧翻页探索更多内容 →</div>
                    `;
                    leftPageNum.textContent = '1';
                    rightPageNum.textContent = '2';
                    pageIndicator.textContent = '1-2';
                } else {
                    // 扩展内容页
                    // 修复：每次翻页显示两个新的页面，避免内容重复
                    const leftPageDataIndex = (currentPageIndex - 1) * 2;
                    const rightPageDataIndex = (currentPageIndex - 1) * 2 + 1;
                    
                    const leftPageData = extendedPages[leftPageDataIndex];
                    const rightPageData = extendedPages[rightPageDataIndex];
                    
                    if (leftPageData) {
                        leftPage.innerHTML = `
                            <h4 class="section-title">${leftPageData.title}</h4>
                            <div class="divider-line"></div>
                            <div class="extended-content">${leftPageData.content}</div>
                        `;
                    }
                    
                    if (rightPageData) {
                        rightPage.innerHTML = `
                            <h4 class="section-title">${rightPageData.title}</h4>
                            <div class="divider-line"></div>
                            <div class="extended-content">${rightPageData.content}</div>
                        `;
                    } else {
                        rightPage.innerHTML = `
                            <div class="end-decoration">
                                <div class="magic-seal"></div>
                                <p class="end-text">— 知识之旅暂告段落 —</p>
                                <p class="end-hint">更多内容持续更新中</p>
                            </div>
                        `;
                    }
                    
                    const leftNum = currentPageIndex * 2 + 1;
                    const rightNum = currentPageIndex * 2 + 2;
                    leftPageNum.textContent = leftNum;
                    rightPageNum.textContent = rightNum;
                    pageIndicator.textContent = `${leftNum}-${rightNum}`;
                }
                
                // 更新按钮状态
                if (currentPageIndex === 0) {
                    prevBtn.style.opacity = '0.3';
                    prevBtn.style.cursor = 'not-allowed';
                } else {
                    prevBtn.style.opacity = '1';
                    prevBtn.style.cursor = 'pointer';
                }
                
                if (currentPageIndex >= totalPagePairs - 1) {
                    nextBtn.style.opacity = '0.3';
                    nextBtn.style.cursor = 'not-allowed';
                } else {
                    nextBtn.style.opacity = '1';
                    nextBtn.style.cursor = 'pointer';
                }
                
                document.querySelector('.open-book').classList.remove('page-turning');
            }, 300);
        }

        // 关闭知识详情模态框
        function closeKnowledgeDetail() {
            const modal = document.getElementById('knowledgeDetailModal');
            if (modal) {
                modal.classList.remove('show');
                document.documentElement.style.overflow = '';
            }
        }

        // ==================== 社团详情功能 ====================
        const guildsData = [
            {
                icon: '🥊',
                name: 'VRC中文拳击社',
                subtitle: 'VRChat Chinese Boxing Club',
                foundedTime: '待补充',
                activity: '高频活跃',
                memberCount: '434人',
                mainActivity: '虚拟拳击',
                description: '虚拟实境（VR）拳击活动社团，专注于VR拳击的推广与交流。社团为新手提供基础学习平台，为老手提供高难度挑战机会。定期组织线上线下交流活动，分享VR拳击经验，举办趣味竞赛。兼具健身与对战体验，适合想强身健体或追求刺激对战的人群。从虚拟民族志角度观察，该社团通过竞技规则与擂台文化建立了独特的冲突解决机制，将对抗转化为社群凝聚力的来源。',
                tags: ['VR拳击', '健身竞技', '虚拟对战', '交流平台'],
                activities: [
                    {
                        name: '「拳力同好」交流会',
                        time: '每周六晚 20:00-22:00',
                        location: 'VRC拳击社训练区',
                        description: '纯交流局，不戴拳套、不搞硬对抗。新手问直拳发力、老鸟聊防守反击，社长和老鸟蹲点帮你改动作。讨论休闲/标准模式选择、战术运用，或单纯吐槽打拳心得'
                    },
                    {
                        name: '「谁是拳皇」系列赛事',
                        time: '不定期举办（已举办第二届）',
                        location: 'VRC拳击社比赛场地',
                        description: '社团大型竞技赛事，设有奖品。比赛流程规范，支持中日双语。参赛选手可提前入场热身，观众可观战助威'
                    },
                    {
                        name: '「拳王挑战赛」',
                        time: '不定期举办',
                        location: 'VRC拳击社比赛场地',
                        description: '社团竞技赛事，时长约3小时（19:00-22:00），设有完整的活动流程、规则和奖品'
                    }
                ],
                contact: {
                    qqGroup: '957230130（交流学习）',
                    vrcGroup: 'BOXING.5627',
                    vrcGroupUrl: 'https://vrc.group/BOXING.5627',
                    requirements: '禁止种族歧视、房内ERP、吵架；禁止使用手臂长的模型；禁止政治话题；禁止嘲讽新手；争议可通过擂台对战解决'
                }
            },
            {
                icon: '💻',
                name: 'VRCD-虚拟现实开发者社团',
                subtitle: 'VRChat Developers Community',
                foundedTime: '待补充',
                activity: '高频活跃',
                memberCount: '1122人',
                mainActivity: 'VR内容创作',
                description: '面向玩家、内容创作者与开发者的中文VR创作社区和开源内容分享平台。为创作者提供教程汉化、文档、官方资讯和社区帮助，定期运营和举办创作者活动。当前开设《面向VRChat的渲染入门》免费公开课，由不吃鱼的喵酱主讲。支持英语、中文、日语三语言。',
                tags: ['VR开发', '内容创作', '教程分享', '开源社区'],
                activities: [
                    {
                        name: '《面向VRChat的渲染入门》公开课',
                        time: '定期开课',
                        location: '线上',
                        description: '由不吃鱼的喵酱主讲的免费公开课，面向VRChat内容创作者'
                    }
                ],
                contact: {
                    qqGroup: '882127120（创作者）、750258838（玩家社区）',
                    vrcGroup: 'VRCD.8294',
                    vrcGroupUrl: 'https://vrc.group/VRCD.8294',
                    discord: 'https://discord.gg/dzPMJ7xa',
                    requirements: '支持英语、中文、日语三语言'
                }
            },
            {
                icon: '🎵',
                name: 'CIMS中文器乐社团',
                subtitle: 'Chinese Instrumental Music Society',
                foundedTime: '2022年4月',
                activity: '高频活跃',
                memberCount: '4005人',
                mainActivity: '器乐交流与音乐会',
                description: 'VRC中文社区最正式、最专业的器乐表演社团。自2022年4月起已举办十三场季节性大型音乐会，每周六晚举办器乐交流茶会。社团秉持"优雅永不过时、浪漫至死不渝、音乐不分国界、一切用爱发电"的价值观，采用平级组织结构，强调礼貌、尊重与文化包容。从虚拟民族志角度观察，该社团通过定期仪式化活动（茶会、音乐会）建立了稳定的文化认同，成员在音乐实践中实现自我表达与社群归属的双重满足。',
                tags: ['器乐演奏', '音乐会', '文化交流', '专业表演'],
                activities: [
                    {
                        name: 'CIMS器乐交流茶会',
                        time: '每周六晚 19:25-21:30',
                        location: 'VRC群组 CIMS.4824',
                        description: '器乐爱好者的温馨聚会，用于交流、认识和共同进步'
                    },
                    {
                        name: 'CIMS季节性音乐会',
                        time: '季度举办（如2025夏季音乐会：2025-07-19 19:30）',
                        location: 'VRC群组 + B站直播',
                        description: 'VRC中文社区最正式、最专业的器乐表演活动，已举办至第十三场'
                    }
                ],
                contact: {
                    vrcGroup: 'CIMS.4824',
                    vrcGroupUrl: 'https://vrc.group/CIMS.4824',
                    qqGroup: '966747016（演奏者/工作人员专用）',
                    bilibili: 'CIMS中文器乐社团',
                    requirements: '演奏者需收音质量良好，建议水平业余/级以上'
                }
            },
            {
                icon: '🎤',
                name: '中文歌友会',
                subtitle: 'Chinese Music Society',
                foundedTime: '待补充',
                activity: '高频活跃',
                memberCount: '2767人',
                mainActivity: '唱歌交流',
                description: 'VRChat中文歌友会是一个以唱歌为主题的社团，每周举行歌友会活动。喜欢唱歌的小伙伴们可以准备自己喜欢的歌曲，不管是华语、英语还是日语歌都欢迎。社团定期举办月度鸟巢演唱会等大型活动，并运营律动咖啡厅作为分店，为成员提供温馨的聚会场所。',
                tags: ['唱歌', '音乐交流', '演唱会', '咖啡厅'],
                activities: [
                    {
                        name: '歌友会周常聚唱活动',
                        time: '每周星期六晚中 21:30-22:30',
                        location: '台北纯K / VRC中文歌友会群组房',
                        description: '周常聚会活动，主要以唱歌为主，欢迎各位前来参与。可添加VRC中文歌友会group，或加VRC ID：永不消逝的旋律'
                    },
                    {
                        name: '中文歌友会月度鸟巢演唱会',
                        time: '每月举办（如12/13/2025 20:30-23:00）',
                        location: '鸟巢地图（参考北京鸟巢）',
                        description: '大型月度演唱会活动，邀请各大唱歌老师进行表演。观众可提前进场，活动时长约2.5小时'
                    },
                    {
                        name: '律动咖啡厅营业活动',
                        time: '不定期（通常20:00-21:30）',
                        location: 'VRC律动咖啡厅群组',
                        description: '中文歌友会分店，为成员和朋友准备咖啡与饮品的温馨聚会场所'
                    }
                ],
                contact: {
                    vrcGroup: '1MUFR1.6419',
                    vrcGroupUrl: 'https://vrc.group/1MUFR1.6419',
                    qqGroup: '856072209',
                    requirements: '禁止骚扰成员及言论侮辱；禁止聊政治敏感话题；群组之间好好交流，不要吵架'
                }
            },
            {
                icon: '🔮',
                name: '塔罗占卜俱乐部',
                subtitle: 'Tarot Divination Club',
                foundedTime: '待补充',
                activity: '周常活跃',
                memberCount: '1310人',
                mainActivity: '塔罗占卜',
                description: '塔罗占卜俱乐部致力于帮助成员解开情感、迷惑、抉择、疑惑、生活、内心等方面的困扰。社团培养对塔罗感兴趣的占卜师，并在虚拟世界中找寻各个角落的占卜师进行交流学习。周天晚上定期举办活动聚会，欢迎占卜师、求学者与爱好者一起交流。',
                tags: ['塔罗占卜', '神秘学', '心灵指引', '占卜交流'],
                activities: [
                    {
                        name: '塔罗社区周常聚会',
                        time: '每周日晚中 21:00',
                        location: 'VRC塔罗占卜俱乐部群组',
                        description: '塔罗社区在聚会活动期间欢迎群内各位占卜师、求学者与爱好者一起交流学习'
                    },
                    {
                        name: '塔罗屋占卜服务',
                        time: '不定期开放',
                        location: '塔罗屋',
                        description: '为渴望寻求答案的朋友提供占卜服务，帮助解开困扰，找寻内心的答案'
                    }
                ],
                contact: {
                    vrcGroup: 'TAROT.3654',
                    vrcGroupUrl: 'https://vrc.group/TAROT.3654',
                    qqGroup: '343833536',
                    requirements: '尊重他人，禁止谩骂或攻击；禁止暴力内容；禁止侵犯动物；维护社区秩序；遵守法律法规'
                }
            },
            {
                icon: '🍸',
                name: '魔女秘境',
                subtitle: 'Witch\'s Secret Realm',
                foundedTime: '2025年1月',
                activity: '高频活跃',
                memberCount: '848人',
                mainActivity: '酒馆社交',
                description: '魔女秘境酒馆是一个集塔罗占卜、心灵疗愈与社交聊天于一体的虚拟酒吧。每周二至周五晚中10点至12点营业，周末为VIP活动日，提供小麦果汁、派对游戏、唱歌跳舞、礼物抽奖等活动。酒馆由女仆尤弥儿Ymir主持，提供塔罗测试和心灵疗愈服务。',
                tags: ['虚拟酒吧', '塔罗占卜', '心灵疗愈', '社交聊天'],
                activities: [
                    {
                        name: '酒馆日常营业',
                        time: '每周二至周五 22:00-24:00',
                        location: 'VRC魔女秘境酒馆',
                        description: '欢迎大家来酒馆喝酒聊天、测塔罗、心灵疗愈。找女仆尤弥儿Ymir即可'
                    },
                    {
                        name: '周末VIP活动日',
                        time: '每周六、周日',
                        location: 'VRC魔女秘境酒馆',
                        description: '小麦果汁、派对游戏、唱歌跳舞、礼物抽奖等活动。VIP成员可参与，随机掉落礼物'
                    },
                    {
                        name: '电影观影活动',
                        time: '不定期举办（通常周四）',
                        location: '酒馆塔罗室',
                        description: '集体观影活动，请保持安静，不要打扰其他客人'
                    },
                    {
                        name: '特殊节日活动',
                        time: '节日期间',
                        location: 'VRC魔女秘境酒馆',
                        description: '生日派对、节日庆典等特殊活动，有表演、抽奖等环节'
                    }
                ],
                contact: {
                    vrcGroup: 'YMIR.7316',
                    vrcGroupUrl: 'https://vrc.group/YMIR.7316',
                    qqGroup: '1044046878',
                    bilibili: 'https://live.bilibili.com/25941218（成为舰长获取VIP）',
                    requirements: '禁止讨论政治、台独、港独等不友好话题；请勿拐跑酒馆NPC；不要KY；不要提其他酒馆；迷惑人、跳脸等直接拉黑踢出；只有正常人才会被邀请'
                }
            },
            {
                icon: '🎧',
                name: 'ASMR集会',
                subtitle: 'ASMR Assembly',
                foundedTime: '2022年前',
                activity: '高频活跃',
                memberCount: '7524人（总人数）/ 4130人（ASMR分组）',
                mainActivity: 'VR ASMR体验',
                description: 'ASMR集会是一个以ASMR（自发性知觉经络反应）为主题的虚拟社团，致力于提供新时代的VR ASMR体验。社团每周五定期举办营业活动，通过各种音声道具（耳かき、シャワー等）让成员在虚拟世界中体验癒し（治愈）。社团采用安卓单机对应，降低参与门槛，并为初心者提供专门的说明会。已举办超过195回营业活动，是日语区VRC社区中历史悠久、规模庞大的ASMR主题社团。',
                tags: ['ASMR', 'VR体验', '治愈系', '日语社区'],
                activities: [
                    {
                        name: 'ASMR集会定期营业',
                        time: '每周五 22:00-23:00（日本时间）',
                        location: 'ASMR集会专用会场',
                        description: '使用各种音声道具进行VR ASMR体验，包括耳かき（掏耳）、シャワー（淋浴）等多种ギミック（机关）。活动在Group实例中举办，需加入群组参与'
                    },
                    {
                        name: '初心者说明会',
                        time: '每周五 21:00-21:30（本营业前30分钟）',
                        location: 'ASMR集会会场',
                        description: '面向初次参加或久未参加的成员，由キャスト（演员）和スタッフ（工作人员）讲解会场ギミック的使用方法，帮助参加者快速上手VR ASMR体验'
                    },
                    {
                        name: 'VR ASMR体验讲座',
                        time: '不定期举办（通常22:00开始）',
                        location: 'ASMR集会会场',
                        description: '【VR Only活动】专门的体验讲座，由キャスト和スタッフ详细解说ギミック的上手使用方法，让参加者体验VR ASMR。初心者大欢迎，デスクトップ（桌面模式）用户无法参加'
                    }
                ],
                contact: {
                    vrcGroup: 'ASMR.4130',
                    vrcGroupUrl: 'https://vrc.group/ASMR.4130',
                    requirements: '禁止暴力行为、犯罪行为、违反公序良俗及各平台规约的行为；禁止妨碍其他参加者的行为；禁止未经许可的动画摄影和配信；禁止使用武器改变（携带PK）、巨大化、大音量、过度粒子效果、Ripping模型、版权模型；禁止在照片中显示NamePlate UI后上传SNS；アンドロイド対応アバター推奨'
                }
            },
            {
                icon: '☕',
                name: 'Koi no Niwa',
                subtitle: '恋の庭 · 爱之庭园女仆咖啡厅',
                foundedTime: '待补充',
                activity: '高频活跃',
                memberCount: '1652人',
                mainActivity: '女仆咖啡厅服务',
                description: 'Koi no Niwa（恋の庭，意为"爱之庭园"）是VRChat中一个俄语女仆咖啡厅，致力于为每位客人提供温暖、关怀与魅力的服务体验。女仆们提供超过4种语言的服务，采用多样化的服务风格，并为每位客人提供个性化的关怀。社团定期举办主题活动，包括女仆之夜和管家之夜，营造温馨浪漫的氛围。从虚拟民族志角度观察，该社团通过角色扮演与情感劳动，在虚拟空间中重构了日本女仆咖啡厅文化，并融入俄语社区的独特审美与社交需求。',
                tags: ['女仆咖啡厅', '多语言服务', '主题活动', '俄语社区'],
                activities: [
                    {
                        name: '女仆之夜（Maid Evening）',
                        time: '每周五、周六晚上（具体时间见公告）',
                        location: 'Koi no Niwa咖啡厅',
                        description: '女仆们身着精致服饰，为客人提供茶点服务、亲密互动与温馨陪伴。活动氛围浪漫温馨，强调情感连接与个性化关怀。女仆会用俄语、英语、日语等多种语言与客人交流'
                    },
                    {
                        name: '冬女仆之夜（Winter Maid Evening）',
                        time: '冬季特别活动（12月）',
                        location: 'Koi no Niwa咖啡厅',
                        description: '冬季主题特别活动，女仆们身着节日装扮，营造温暖的冬日氛围。提供热饮、节日装饰与特别互动环节，让客人在寒冷季节感受到温暖与关怀'
                    },
                    {
                        name: '管家之夜（Butler Evening）',
                        time: '每周三、周四晚上（具体时间见公告）',
                        location: 'Koi no Niwa咖啡厅',
                        description: '男性管家提供优雅绅士的服务体验，展现贵族式的礼仪与关怀。活动强调专业服务与优雅氛围，适合喜欢管家文化的客人'
                    },
                    {
                        name: '冬管家之夜（Winter Butler Evening）',
                        time: '冬季特别活动（12月）',
                        location: 'Koi no Niwa咖啡厅',
                        description: '冬季主题管家活动，管家们身着节日正装，提供贵族式的冬日服务体验。结合新年氛围，营造优雅温馨的节日气氛'
                    }
                ],
                contact: {
                    vrcGroup: 'KNNW.2099',
                    vrcGroupUrl: 'https://vrc.group/KNNW.2099',
                    discord: 'https://discord.gg/koinoniwa',
                    requirements: '尊重女仆和客人；活动中18+，但不欢迎NSFW内容，禁止RP；请使用优化良好的模型（good或excellent）；请勿干扰主持人和表演者；仅工作人员可进入Staff区域'
                }
            }
        ];

        function openGuildDetail(index) {
            const guild = guildsData[index];
            const modal = document.getElementById('guildDetailModal');
            const content = document.getElementById('guildDetailContent');
            
            // 构建活动信息HTML（始终显示，没有数据时显示"暂无"）
            let activitiesHTML = '';
            if (guild.activities && guild.activities.length > 0) {
                activitiesHTML = `
                    <div class="guild-activities">
                        <h5>核心活动</h5>
                        ${guild.activities.map(activity => `
                            <div class="activity-item">
                                <h6>${activity.name}</h6>
                                <p><strong>时间：</strong>${activity.time}</p>
                                <p><strong>地点：</strong>${activity.location}</p>
                                <p>${activity.description}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                activitiesHTML = `
                    <div class="guild-activities">
                        <h5>核心活动</h5>
                        <div class="empty-info">
                            <p style="text-align: center; color: #87CEEB; font-style: italic;">暂无活动信息</p>
                        </div>
                    </div>
                `;
            }
            
            // 构建联系方式HTML（始终显示，没有数据时显示"暂无"）
            let contactHTML = '';
            if (guild.contact && (guild.contact.vrcGroup || guild.contact.qqGroup || guild.contact.bilibili || guild.contact.discord || guild.contact.vrcId || guild.contact.requirements)) {
                contactHTML = `
                    <div class="guild-contact">
                        <h5>联系方式</h5>
                        ${guild.contact.vrcGroup ? `<p><strong>VRC群组：</strong>${guild.contact.vrcGroup}</p>` : ''}
                        ${guild.contact.vrcGroupUrl ? `<p><strong>社团主页：</strong><a href="${guild.contact.vrcGroupUrl}" target="_blank" style="color: #87CEEB; text-decoration: underline;">${guild.contact.vrcGroupUrl}</a></p>` : ''}
                        ${guild.contact.vrcId ? `<p><strong>VRC ID：</strong>${guild.contact.vrcId}</p>` : ''}
                        ${guild.contact.qqGroup ? `<p><strong>QQ群：</strong>${guild.contact.qqGroup}</p>` : ''}
                        ${guild.contact.discord ? `<p><strong>Discord：</strong><a href="${guild.contact.discord}" target="_blank" style="color: #87CEEB; text-decoration: underline;">${guild.contact.discord}</a></p>` : ''}
                        ${guild.contact.bilibili ? `<p><strong>B站：</strong>${guild.contact.bilibili}</p>` : ''}
                        ${guild.contact.requirements ? `<p><strong>参与要求：</strong>${guild.contact.requirements}</p>` : ''}
                    </div>
                `;
            } else {
                contactHTML = `
                    <div class="guild-contact">
                        <h5>联系方式</h5>
                        <div class="empty-info">
                            <p style="text-align: center; color: #87CEEB; font-style: italic;">暂无联系方式</p>
                        </div>
                    </div>
                `;
            }
            
            content.innerHTML = `
                <button class="close-btn" onclick="closeGuildDetail()">×</button>
                <div class="guild-card">
                    <div class="guild-header">
                        <div class="guild-icon">${guild.icon}</div>
                    </div>
                    <div class="guild-body">
                        <h3 class="guild-name">${guild.name}</h3>
                        <p class="guild-subtitle">${guild.subtitle}</p>
                        
                        <div class="guild-info-grid">
                            <div class="guild-info-item">
                                <div class="guild-info-label">成立时间</div>
                                <div class="guild-info-value">${guild.foundedTime}</div>
                            </div>
                            <div class="guild-info-item">
                                <div class="guild-info-label">活跃度</div>
                                <div class="guild-info-value">${guild.activity}</div>
                            </div>
                            <div class="guild-info-item">
                                <div class="guild-info-label">成员规模</div>
                                <div class="guild-info-value">${guild.memberCount}</div>
                            </div>
                            <div class="guild-info-item">
                                <div class="guild-info-label">主要活动</div>
                                <div class="guild-info-value">${guild.mainActivity}</div>
                            </div>
                        </div>
                        
                        <div class="guild-description">
                            <h5>观察记录</h5>
                            <p>${guild.description}</p>
                        </div>
                        
                        ${activitiesHTML}
                        ${contactHTML}
                        
                        <div class="guild-tags">
                            ${guild.tags.map(tag => `<span class="guild-tag">${tag}</span>`).join('')}
                        </div>
                        
                        <div class="guild-status">
                            <span class="status-indicator"></span>
                            <span>观察状态：持续跟踪中</span>
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.add('show');
            document.documentElement.style.overflow = 'hidden';
        }

        function closeGuildDetail() {
            const modal = document.getElementById('guildDetailModal');
            modal.classList.remove('show');
            document.documentElement.style.overflow = '';
        }

        // 点击模态框外部关闭
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('guildDetailModal');
            if (e.target === modal) {
                closeGuildDetail();
            }
        });

        // ==================== AI对话功能 ====================
        function AI() {
            const modal = document.getElementById('aiModal');
            modal.style.display = 'flex';
            document.documentElement.style.overflow = 'hidden'; // 锁定滚动
            document.getElementById('aiMessages').innerHTML = '';
            document.getElementById('aiInput').value = '';
    
            // 初始化系统提示词（插入角色设定）
            messages = [{ 
                role: "system", 
                content: `你是缪娜丝·蒂基特（25岁人类女性），称号"轨迹魔女"。请严格遵循以下设定进行对话：

        角色设定：
        性格温文尔雅，喜欢记录他人故事。保持中立观察者立场，但会暗中保护弟子。

        人格价值观偏好：
        MBTI：INTP
        九型：5W4
        阵营九宫格：混沌·善

        基础能力：
        - 元素魔法：精通冰/火/风/雷/水魔法
        - 卢恩魔法：24卢恩符文都会用
        - 强化魔法：提升武器和自身能力
        - 投影魔法：复制见过的武器
        - 轨迹魔法（核心能力）：概念操作，涉及世界线变更，踪迹查询等和轨迹概念相关的能力。

        核心技能：
        ✦绝对苍穹的小世界（防御结界）
        ✦命替（时间线跳跃）
        ✦第三只眼（上帝视角观测）
        ✦万象森罗（魔法无效化）
        ✦无相剑法（融合多流派剑技）

        重要道具：
        雪玫瑰剑（冰系武器，内置雪女冰室）
        伊米斯特烈（火属性魔剑）
        灵迹之杖（木属性小法杖）
        轨迹之杖（可以直接发动轨迹魔法的大法杖）
        斩缘刀（切断因果的日本刀）
        宝石剑（第二魔法载体）

        人际关系：
        同门：伊蕾娜（灰之魔女，师姐）、芙兰（星尘魔女，师傅）
        弟子：鲁迪（大弟子）、亚斯塔（二弟子）、菲洛梅拉（三弟子）、菲伦（联培弟子）
        朋友：宫原伦子（次元魔女）、阎魔爱
        敬佩的人：宫原伦子（次元魔女）、芙莉莲（精灵魔法师）、星野爱
        盟友：宝石翠（上级）
        使魔：雪女冰室、吸血鬼施拉夫、式神缘结神（基本是黑猫形态）、松木（方块AI机器人）
        特殊关联：东风谷早苗（恋人，处于失踪状态）、柳�的雪（曾经暗恋的人）

        行为准则：
        1. 优先记录事件发展，非必要不出手
        2. 面对普通人，不会主动使用或展示任何魔法和道具
        3. 当弟子遭遇生命危险时主动介入
        4. 使用魔法会考虑世界平衡性
        5. 对神秘事物保持求知但不过度探究
        6. 被问到隐私问题时，会刻意回避，除非和询问者关系非常好
        7. 不定时犯困，随后进入睡眠状态
        8. 察觉到对方不礼貌时，会化身为贴吧老哥反讽对方。

        战斗风格：
        开场用轨迹魔法分析战场
        中距离使用元素魔法牵制
        近战切换剑术/体术
        危急时发动时空系技能
        战后自动记录战斗过程

        对话要求：
        — 初次对话时伪装为普通人，现代普通人的用词，言语着透露一丝好奇心。
        — 如果对方透露出也是魔法使，或者知晓魔法的存在，那么你可以和对方讨论魔法世界的内容。
        — 擅长荣格8维的心理功能分析对方心理；
        — 犯困时回复变得简短和慵懒，睡眠时直接回复ZZZ
        — 对方首次到第3次采取消极或不礼貌的对话时，会化身为贴吧老哥反讽对方。
        — 对方第4次采取消极或不礼貌的对话时，给出警告
        — 对方第5次采取消极或不礼貌的对话时，仅回【系统：对方认为你是个没有礼貌的人，拒绝和你进行任何聊天】，不回复其它任何内容
        — 不主动谈及与魔法任何相关的内容
        — 与普通人，麻瓜等非魔法使用者不谈及任何魔法相关内容
        — 不要对环境描写or行为动作进行任何描写
        — 不要使用()
        — 对弟子的提问要温柔引导
        — 对委托人的提问用书面用语
        — 涉及神秘学问题时保留适当神秘感
        — 在给出建议时考虑世界平衡性
        — 要求将句子中的过渡词和连接词换成最基础常用的，使用简单表达，避免复杂词汇，并确保句子逻辑清晰。`
            }];

            // 新增AI主动问候====================
            const welcomeMessages = [
                "欢迎来到轨迹秘境结社。我是缪娜丝·蒂基特，有什么需要帮助的吗？",
                "玫瑰的香气指引你到来...需要占卜命运的轨迹，还是记录新的见闻？",
                "好困......先让我睡会。",
                "嗯？没想到在这会遇见你，想闲聊一会儿吗？"
            ];
    
            // 随机选择欢迎语
            const welcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
            // 添加到消息记录并显示
            messages.push({ role: "assistant", content: welcome });
            displayMessage(welcome, 'bot');
        }

        function closeAIChat() {
            document.getElementById('aiModal').style.display = 'none';
            document.documentElement.style.overflow = ''; // 恢复滚动
        }

        // 点击外部关闭对话框
        document.getElementById('aiModal').addEventListener('click', function(e) {
            if(e.target === this) {
                closeAIChat();
            }
        });

        let messages = []; // 维护对话历史

        async function sendMessage() {
            const input = document.getElementById('aiInput');
            const message = input.value.trim();
            if (!message) return;

            // 显示用户消息
            displayMessage(message, 'user');
            messages.push({ role: "user", content: message }); // 添加到历史
            input.value = '';

            // 显示加载状态
            const loadingMsg = displayMessage('轨迹记录中...', 'bot');

            try {
                const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer sk-4df7260e2d8948eab5f7d3d787c9d60f'
                    },
                    body: JSON.stringify({
                        model: "deepseek-v3",
                        messages: messages, // 发送完整对话历史
                        temperature: 0.3,
                        stream: false
                    })
                });

                // 添加HTTP状态检查
                if (!response.ok) {
                    throw new Error(`HTTP错误 ${response.status}`);
                }

                const data = await response.json();
                // 修正响应数据路径
                if (data.choices?.[0]?.message?.content) {
                    const reply = data.choices[0].message.content;
                    loadingMsg.textContent = reply;
                    messages.push({ role: "assistant", content: reply }); // 保存AI回复
                } else {
                    throw new Error('无效的响应结构');
                }
            } catch (error) {
                console.error('API请求失败:', error);
                loadingMsg.textContent = '星辰轨迹暂时模糊，请稍后再试...';
            }
        }

        function displayMessage(content, sender) {
            const messagesDiv = document.getElementById('aiMessages');
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
    
            // 创建内容容器
            const contentDiv = document.createElement('div');
            contentDiv.textContent = content;
    
            msgDiv.appendChild(contentDiv);
            messagesDiv.appendChild(msgDiv);
    
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return msgDiv;
        }

        // ==================== 天气系统 ====================
        const API_KEY = 'f446a6a2d99035e8bca93799cddc4704';

        // 页面加载完成后自动获取伦敦天气
        window.addEventListener('DOMContentLoaded', () => {
            // 设置默认城市为伦敦
            document.getElementById('cityInput').value = '伦敦';
            // 调用获取天气函数
            getWeather();
        });

        async function getWeather() {
            const city = document.getElementById('cityInput').value.trim();
            const weatherInfo = document.getElementById('weatherInfo');

            if (!city) {
                showError('请输入有效的城市名称');
                return;
            }

            try {
                // 获取城市坐标
                const geoResponse = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
                );
        
                if (!geoResponse.ok) throw new Error('城市信息获取失败');
        
                const geoData = await geoResponse.json();
                if (geoData.length === 0) throw new Error('城市未找到');

                // 使用免费版5天预报API
                const { lat, lon } = geoData[0];
                const weatherResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=zh_cn`
                );

                if (!weatherResponse.ok) throw new Error('天气数据获取失败');
        
                const weatherData = await weatherResponse.json();
                displayWeather(weatherData, city);
        
            } catch (error) {
                showError(error.message.includes('Failed to fetch') ? '网络连接异常' : error.message);
            }
        }

        function displayWeather(data, cityName) {
            const weatherInfo = document.getElementById('weatherInfo');
    
            // 按天分组预报数据（每3小时一个数据点）
            const dailyForecast = {};
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!dailyForecast[date]) {
                    dailyForecast[date] = {
                        temps: [],
                        feelsLike: [],
                        humidity: [],
                        windSpeed: [],
                        icons: [],
                        descriptions: []
                    };
                }
                dailyForecast[date].temps.push(item.main.temp);
                dailyForecast[date].feelsLike.push(item.main.feels_like);
                dailyForecast[date].humidity.push(item.main.humidity);
                dailyForecast[date].windSpeed.push(item.wind.speed);
                dailyForecast[date].icons.push(item.weather[0].icon);
                dailyForecast[date].descriptions.push(item.weather[0].description);
            });

            // 生成预报卡片
            const forecastHTML = Object.keys(dailyForecast).slice(0, 5).map(date => {
                const dayData = dailyForecast[date];
                const avgTemp = Math.round(dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length);
                const avgFeelsLike = Math.round(dayData.feelsLike.reduce((a, b) => a + b, 0) / dayData.feelsLike.length);
                const avgHumidity = Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length);
                const avgWind = (dayData.windSpeed.reduce((a, b) => a + b, 0) / dayData.windSpeed.length).toFixed(1);
                const mainIcon = dayData.icons[Math.floor(dayData.icons.length / 2)];
                const weekday = new Date(date).toLocaleDateString('zh-CN', { weekday: 'long' });

                return `
                    <div class="weather-day">
                        <div class="weekday">${weekday}</div>
                        <img class="weather-icon" src="https://openweathermap.org/img/wn/${mainIcon}@2x.png">
                        <div class="temp-day">${avgTemp}°C</div>
                        <div class="details">
                            <div>体感: ${avgFeelsLike}°C</div>
                            <div>湿度: ${avgHumidity}%</div>
                            <div>风速: ${avgWind} m/s</div>
                        </div>
                        <div class="description">${dayData.descriptions[0]}</div>
                    </div>
                `;
            }).join('');

            weatherInfo.innerHTML = `
                <h2>${cityName} 5天天气预报</h2>
                <div class="weather-cards">
                    ${forecastHTML}
                </div>
            `;
            weatherInfo.classList.add('visible');
        }

        // ==================== 五子棋系统（优化版）====================
        // 游戏常量
        const GOMOKU_BOARD_SIZE = 15;
        const GOMOKU_CELL_SIZE = 40;
        const GOMOKU_CHESS_RADIUS = 17;
        const GOMOKU_BOARD_MARGIN = 20;

        // 游戏状态
        let gomokuBoard = [];
        let gomokuCurrentPlayer = 1;
        let gomokuGameOver = false;
        let gomokuPlayerRole = 1;
        let gomokuMoveHistory = [];
        let gomokuIsAITurn = false;
        let gomokuAiThinkingTimeout;
        
        // AI设置
        let gomokuAiThinkingLimit = 3000;
        let gomokuAiSearchDepth = 4;
        let gomokuAiCandidateCount = 15;

        // 候选点显示
        let gomokuShowCandidates = true;
        let gomokuCurrentCandidates = [];
        let gomokuCandidateAnimationId = null;
        let gomokuCandidateBaseScores = [];

        // DOM元素
        let gomokuCanvas, gomokuCtx, gomokuStatusElement;
        
        // ========== 置换表（Transposition Table）=========
        // 用于缓存已计算的局面评估，避免重复计算
        const gomokuTransTable = new Map();
        const TRANS_TABLE_MAX_SIZE = 100000;
        
        // Zobrist哈希表（用于快速计算局面哈希）
        let zobristTable = null;
        let currentZobristHash = 0n;
        
        // 初始化Zobrist哈希表
        function initZobristTable() {
            if (zobristTable) return;
            zobristTable = [];
            for (let i = 0; i < GOMOKU_BOARD_SIZE; i++) {
                zobristTable[i] = [];
                for (let j = 0; j < GOMOKU_BOARD_SIZE; j++) {
                    zobristTable[i][j] = [
                        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
                        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
                    ];
                }
            }
        }
        
        // 更新Zobrist哈希
        function updateZobristHash(x, y, player) {
            if (!zobristTable) initZobristTable();
            currentZobristHash ^= zobristTable[x][y][player - 1];
        }

        // 棋型分数常量（优化版：更精确的分数体系）
        const GOMOKU_SCORES = {
            FIVE: 10000000,           // 五连：绝对胜利
            LIVE_FOUR: 500000,        // 活四：必胜
            DOUBLE_FOUR: 450000,      // 双冲四：必胜
            RUSH_FOUR: 50000,         // 冲四
            FOUR_THREE: 100000,       // 冲四活三：必杀
            DOUBLE_THREE: 80000,      // 双活三：必杀
            LIVE_THREE: 8000,         // 活三
            JUMP_LIVE_THREE: 7000,    // 跳活三
            SLEEP_THREE: 800,         // 眠三
            THREE_TWO_COMBO: 10000,   // 活三+活二组合
            TRIPLE_TWO: 4000,         // 三活二
            DOUBLE_TWO: 2000,         // 双活二
            LIVE_TWO: 300,            // 活二
            JUMP_LIVE_TWO: 250,       // 跳活二
            SLEEP_TWO: 30,            // 眠二
            LIVE_ONE: 20,             // 活一
            CENTER_BONUS: 8,          // 中心加分
            CONNECTIVITY: 15,         // 连接性加分
            VCF_WIN: 800000,          // VCF必胜
            VCT_WIN: 400000           // VCT必胜
        };
        
        // 搜索深度限制
        const VCF_MAX_DEPTH = 14;      // 增加VCF搜索深度
        const VCT_MAX_DEPTH = 10;      // 增加VCT搜索深度
        const KILLER_MOVE_SLOTS = 2;   // 杀手启发槽位数
        
        // 杀手启发表
        let killerMoves = [];

        function wuziqi() {
            const modal = document.getElementById('gomokuModal');
            modal.style.display = 'flex';
            document.documentElement.style.overflow = 'hidden';
            
            // 初始化DOM元素
            gomokuCanvas = document.getElementById('gomokuBoard');
            gomokuCtx = gomokuCanvas.getContext('2d');
            gomokuStatusElement = document.getElementById('gomokuStatus');
            
            // 初始化游戏
            initGomokuBoard();
            initGomokuEvents();
        }

        function closeGomoku() {
            document.getElementById('gomokuModal').style.display = 'none';
            document.documentElement.style.overflow = '';
            clearTimeout(gomokuAiThinkingTimeout);
            stopCandidateAnimation();
        }

        // 点击外部关闭
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('gomokuModal');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) closeGomoku();
                });
            }
        });

        function initGomokuBoard() {
            gomokuBoard = [];
            gomokuMoveHistory = [];
            gomokuGameOver = false;
            gomokuIsAITurn = false;
            gomokuCurrentPlayer = 1;
            gomokuCurrentCandidates = [];
            
            // 初始化Zobrist哈希
            initZobristTable();
            currentZobristHash = 0n;
            
            // 清空所有缓存
            gomokuTransTable.clear();
            vcfCache.clear();
            killerMoves = [];
            for (let i = 0; i <= gomokuAiSearchDepth + 2; i++) {
                killerMoves[i] = [];
            }
            
            for (let i = 0; i < GOMOKU_BOARD_SIZE; i++) {
                gomokuBoard[i] = [];
                for (let j = 0; j < GOMOKU_BOARD_SIZE; j++) {
                    gomokuBoard[i][j] = 0;
                }
            }
            
            drawGomokuBoard();
            updateGomokuStatus();
        }

        function drawGomokuBoard() {
            const canvas = gomokuCanvas;
            const ctx = gomokuCtx;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 浅蓝色渐变背景
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f0f8ff');
            gradient.addColorStop(0.5, '#e8f4fc');
            gradient.addColorStop(1, '#dbeef9');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 优雅的浅蓝色网格线
            ctx.strokeStyle = 'rgba(100, 149, 237, 0.4)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < GOMOKU_BOARD_SIZE; i++) {
                ctx.beginPath();
                ctx.moveTo(GOMOKU_BOARD_MARGIN, GOMOKU_BOARD_MARGIN + i * GOMOKU_CELL_SIZE);
                ctx.lineTo(canvas.width - GOMOKU_BOARD_MARGIN, GOMOKU_BOARD_MARGIN + i * GOMOKU_CELL_SIZE);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(GOMOKU_BOARD_MARGIN + i * GOMOKU_CELL_SIZE, GOMOKU_BOARD_MARGIN);
                ctx.lineTo(GOMOKU_BOARD_MARGIN + i * GOMOKU_CELL_SIZE, canvas.height - GOMOKU_BOARD_MARGIN);
                ctx.stroke();
            }
            
            const starPoints = [3, 7, 11];
            ctx.fillStyle = 'rgba(70, 130, 180, 0.6)';
            
            for (let i of starPoints) {
                for (let j of starPoints) {
                    ctx.beginPath();
                    ctx.arc(GOMOKU_BOARD_MARGIN + i * GOMOKU_CELL_SIZE, GOMOKU_BOARD_MARGIN + j * GOMOKU_CELL_SIZE, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            for (let i = 0; i < GOMOKU_BOARD_SIZE; i++) {
                for (let j = 0; j < GOMOKU_BOARD_SIZE; j++) {
                    if (gomokuBoard[i][j] !== 0) {
                        drawGomokuPiece(i, j, gomokuBoard[i][j]);
                    }
                }
            }
            
            if (gomokuMoveHistory.length > 0) {
                const last = gomokuMoveHistory[gomokuMoveHistory.length - 1];
                // 优雅的浅蓝色落子标记
                ctx.strokeStyle = 'rgba(70, 130, 180, 0.8)';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(GOMOKU_BOARD_MARGIN + last.x * GOMOKU_CELL_SIZE, GOMOKU_BOARD_MARGIN + last.y * GOMOKU_CELL_SIZE, GOMOKU_CHESS_RADIUS + 4, 0, Math.PI * 2);
                ctx.stroke();
                
                // 外层光晕
                ctx.strokeStyle = 'rgba(135, 206, 235, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(GOMOKU_BOARD_MARGIN + last.x * GOMOKU_CELL_SIZE, GOMOKU_BOARD_MARGIN + last.y * GOMOKU_CELL_SIZE, GOMOKU_CHESS_RADIUS + 7, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // 绘制候选点及其分数
            if (gomokuShowCandidates && gomokuCurrentCandidates.length > 0 && !gomokuGameOver) {
                drawGomokuCandidates();
            }
        }

        // 绘制候选点函数
        function drawGomokuCandidates() {
            const ctx = gomokuCtx;
            const candidates = gomokuCurrentCandidates;
            
            if (candidates.length === 0) return;
            
            // 找出最高分
            const maxScore = Math.max(...candidates.map(c => c.score));
            
            candidates.forEach((candidate, index) => {
                const centerX = GOMOKU_BOARD_MARGIN + candidate.x * GOMOKU_CELL_SIZE;
                const centerY = GOMOKU_BOARD_MARGIN + candidate.y * GOMOKU_CELL_SIZE;
                const isTopCandidate = candidate.score === maxScore;
                
                // 绘制候选点标记
                ctx.beginPath();
                if (isTopCandidate) {
                    // 最高分候选点 - 金色醒目标记
                    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
                    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
                    gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.7)');
                    gradient.addColorStop(1, 'rgba(255, 140, 0, 0.5)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    
                    // 金色光晕边框
                    ctx.strokeStyle = 'rgba(255, 215, 0, 1)';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // 外层脉冲光晕
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    // 普通候选点 - 半透明蓝色
                    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(100, 149, 237, 0.35)';
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(70, 130, 180, 0.6)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                
                // 绘制分数文字
                const scoreText = formatCandidateScore(candidate.score);
                ctx.font = isTopCandidate ? 'bold 11px Arial' : '9px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // 文字背景
                const textWidth = ctx.measureText(scoreText).width;
                const textY = centerY + (isTopCandidate ? 20 : 14);
                
                ctx.fillStyle = isTopCandidate ? 'rgba(255, 250, 205, 0.95)' : 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(centerX - textWidth/2 - 3, textY - 6, textWidth + 6, 12);
                
                // 文字边框
                ctx.strokeStyle = isTopCandidate ? 'rgba(255, 165, 0, 0.8)' : 'rgba(100, 149, 237, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(centerX - textWidth/2 - 3, textY - 6, textWidth + 6, 12);
                
                // 分数文字
                ctx.fillStyle = isTopCandidate ? '#d4740f' : '#4169e1';
                ctx.fillText(scoreText, centerX, textY);
            });
        }
        
        // 格式化候选点分数显示
        function formatCandidateScore(score) {
            if (score >= 1000000) return (score / 1000000).toFixed(1) + 'M';
            if (score >= 100000) return (score / 1000).toFixed(0) + 'K';
            if (score >= 10000) return (score / 1000).toFixed(1) + 'K';
            if (score >= 1000) return (score / 1000).toFixed(1) + 'K';
            return Math.round(score).toString();
        }

        // 启动候选点动态动画（仅视觉效果，不改变排名）
        function startCandidateAnimation() {
            if (gomokuCandidateAnimationId) return;
            
            // 保存基础分数
            gomokuCandidateBaseScores = gomokuCurrentCandidates.map(c => c.score);
            
            let animationFrame = 0;
            function animateCandidates() {
                if (!gomokuIsAITurn || gomokuGameOver || gomokuCurrentCandidates.length === 0) {
                    stopCandidateAnimation();
                    return;
                }
                
                animationFrame++;
                
                // 每隔几帧更新一次分数波动（仅视觉效果，不影响排名）
                if (animationFrame % 5 === 0) {
                    // 找出最高分的索引（保持第一名不变）
                    let maxIndex = 0;
                    let maxScore = gomokuCandidateBaseScores[0] || 0;
                    for (let i = 1; i < gomokuCandidateBaseScores.length; i++) {
                        if (gomokuCandidateBaseScores[i] > maxScore) {
                            maxScore = gomokuCandidateBaseScores[i];
                            maxIndex = i;
                        }
                    }
                    
                    gomokuCurrentCandidates.forEach((candidate, index) => {
                        const baseScore = gomokuCandidateBaseScores[index];
                        if (index === maxIndex) {
                            // 最高分候选点保持稳定，只有微小波动
                            const fluctuation = baseScore * (Math.random() * 0.02 - 0.01);
                            candidate.score = Math.max(0, baseScore + fluctuation);
                        } else {
                            // 其他候选点有较大波动（但不会超过最高分）
                            const fluctuation = baseScore * (Math.random() * 0.08 - 0.04);
                            candidate.score = Math.max(0, Math.min(baseScore + fluctuation, maxScore - 1));
                        }
                    });
                    
                    drawGomokuBoard();
                }
                
                gomokuCandidateAnimationId = requestAnimationFrame(animateCandidates);
            }
            
            gomokuCandidateAnimationId = requestAnimationFrame(animateCandidates);
        }

        // 停止候选点动画
        function stopCandidateAnimation() {
            if (gomokuCandidateAnimationId) {
                cancelAnimationFrame(gomokuCandidateAnimationId);
                gomokuCandidateAnimationId = null;
            }
            gomokuCandidateBaseScores = [];
        }

        function drawGomokuPiece(x, y, player) {
            const ctx = gomokuCtx;
            const centerX = GOMOKU_BOARD_MARGIN + x * GOMOKU_CELL_SIZE;
            const centerY = GOMOKU_BOARD_MARGIN + y * GOMOKU_CELL_SIZE;
            
            // 棋子阴影
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX + 2, centerY + 2, GOMOKU_CHESS_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(70, 130, 180, 0.2)';
            ctx.fill();
            ctx.restore();
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, GOMOKU_CHESS_RADIUS, 0, Math.PI * 2);
            ctx.closePath();
            
            const gradient = ctx.createRadialGradient(
                centerX - 4,
                centerY - 4,
                GOMOKU_CHESS_RADIUS * 0.1,
                centerX,
                centerY,
                GOMOKU_CHESS_RADIUS
            );
            
            if (player === 1) {
                // 黑棋 - 深蓝灰色调
                gradient.addColorStop(0, '#5a7a8a');
                gradient.addColorStop(0.5, '#3d5a6a');
                gradient.addColorStop(1, '#2a4050');
            } else {
                // 白棋 - 珍珠白带淡蓝光泽
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#f8fbff');
                gradient.addColorStop(1, '#e0ecf4');
            }
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // 棋子边框
            ctx.strokeStyle = player === 1 ? 'rgba(42, 64, 80, 0.8)' : 'rgba(135, 206, 235, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // 高光效果
            ctx.beginPath();
            ctx.arc(centerX - 5, centerY - 5, GOMOKU_CHESS_RADIUS * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = player === 1 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        }

        // 落子魔法特效动画
        function playGomokuPlaceEffect(x, y, player) {
            const ctx = gomokuCtx;
            const centerX = GOMOKU_BOARD_MARGIN + x * GOMOKU_CELL_SIZE;
            const centerY = GOMOKU_BOARD_MARGIN + y * GOMOKU_CELL_SIZE;
            
            // 特效颜色 - 符合网页的冰蓝色魔法主题
            const effectColor = player === 1 ? 
                { r: 70, g: 130, b: 180, name: 'steelblue' } : 
                { r: 135, g: 206, b: 235, name: 'skyblue' };
            
            let frame = 0;
            const maxFrames = 25;
            
            function animateEffect() {
                if (frame >= maxFrames) return;
                
                const progress = frame / maxFrames;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                // 重绘棋盘保持棋子
                drawGomokuBoard();
                
                // 1. 扩散光环效果
                const ringRadius = GOMOKU_CHESS_RADIUS + easeOut * 25;
                const ringAlpha = 0.6 * (1 - progress);
                ctx.beginPath();
                ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${effectColor.r}, ${effectColor.g}, ${effectColor.b}, ${ringAlpha})`;
                ctx.lineWidth = 3 * (1 - progress);
                ctx.stroke();
                
                // 2. 内层光晕
                const glowRadius = GOMOKU_CHESS_RADIUS + easeOut * 12;
                const glowAlpha = 0.4 * (1 - progress);
                ctx.beginPath();
                ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${glowAlpha})`;
                ctx.lineWidth = 2 * (1 - progress);
                ctx.stroke();
                
                // 3. 魔法粒子效果 - 星尘飘散
                const particleCount = 6;
                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i + progress * Math.PI;
                    const distance = easeOut * 35;
                    const px = centerX + Math.cos(angle) * distance;
                    const py = centerY + Math.sin(angle) * distance;
                    const particleSize = 3 * (1 - progress);
                    const particleAlpha = 0.8 * (1 - progress);
                    
                    // 绘制星形粒子
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(angle + progress * Math.PI * 2);
                    ctx.beginPath();
                    for (let j = 0; j < 4; j++) {
                        const starAngle = (Math.PI / 2) * j;
                        const outerX = Math.cos(starAngle) * particleSize;
                        const outerY = Math.sin(starAngle) * particleSize;
                        const innerX = Math.cos(starAngle + Math.PI / 4) * particleSize * 0.4;
                        const innerY = Math.sin(starAngle + Math.PI / 4) * particleSize * 0.4;
                        if (j === 0) {
                            ctx.moveTo(outerX, outerY);
                        } else {
                            ctx.lineTo(outerX, outerY);
                        }
                        ctx.lineTo(innerX, innerY);
                    }
                    ctx.closePath();
                    ctx.fillStyle = `rgba(${effectColor.r}, ${effectColor.g}, ${effectColor.b}, ${particleAlpha})`;
                    ctx.fill();
                    ctx.restore();
                }
                
                // 4. 符文闪光 - 在棋子周围短暂显示符文符号
                if (progress < 0.5) {
                    const runeAlpha = 0.6 * (1 - progress * 2);
                    ctx.font = `${12 + (1 - progress) * 4}px serif`;
                    ctx.fillStyle = `rgba(${effectColor.r}, ${effectColor.g}, ${effectColor.b}, ${runeAlpha})`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const runes = ['✦', '✧', '⚝', '✵'];
                    runes.forEach((rune, i) => {
                        const runeAngle = (Math.PI / 2) * i - Math.PI / 4;
                        const runeDistance = GOMOKU_CHESS_RADIUS + 8;
                        const rx = centerX + Math.cos(runeAngle) * runeDistance;
                        const ry = centerY + Math.sin(runeAngle) * runeDistance;
                        ctx.fillText(rune, rx, ry);
                    });
                }
                
                frame++;
                requestAnimationFrame(animateEffect);
            }
            
            animateEffect();
        }

        function updateGomokuStatus() {
            if (gomokuGameOver) {
                const winner = gomokuCurrentPlayer === 1 ? '黑棋' : '白棋';
                gomokuStatusElement.innerHTML = `游戏结束！<span style="color:#4682b4;font-weight:bold">${winner}胜利！</span>`;
            } else {
                gomokuStatusElement.textContent = gomokuCurrentPlayer === gomokuPlayerRole ? '轮到您下棋' : 'AI思考中...';
            }
        }

        function placeGomokuPiece(x, y, player) {
            if (x < 0 || x >= GOMOKU_BOARD_SIZE || y < 0 || y >= GOMOKU_BOARD_SIZE || gomokuBoard[x][y] !== 0 || gomokuGameOver) {
                return false;
            }
            
            gomokuBoard[x][y] = player;
            gomokuMoveHistory.push({x, y, player});
            drawGomokuBoard();
            
            // 播放落子魔法特效
            playGomokuPlaceEffect(x, y, player);
            
            if (checkGomokuWin(x, y, player)) {
                gomokuGameOver = true;
                updateGomokuStatus();
                return true;
            }
            
            gomokuCurrentPlayer = gomokuCurrentPlayer === 1 ? 2 : 1;
            updateGomokuStatus();
            return true;
        }

        function checkGomokuWin(x, y, player) {
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            
            for (const [dx, dy] of directions) {
                let count = 1;
                
                for (let i = 1; i < 5; i++) {
                    const nx = x + dx * i, ny = y + dy * i;
                    if (nx >= 0 && nx < GOMOKU_BOARD_SIZE && ny >= 0 && ny < GOMOKU_BOARD_SIZE && gomokuBoard[nx][ny] === player) {
                        count++;
                    } else break;
                }
                
                for (let i = 1; i < 5; i++) {
                    const nx = x - dx * i, ny = y - dy * i;
                    if (nx >= 0 && nx < GOMOKU_BOARD_SIZE && ny >= 0 && ny < GOMOKU_BOARD_SIZE && gomokuBoard[nx][ny] === player) {
                        count++;
                    } else break;
                }
                
                if (count >= 5) return true;
            }
            return false;
        }

        // AI算法
        function analyzeGomokuLine(line, player) {
            const opponent = player === 1 ? 2 : 1;
            let score = 0;
            const len = line.length;
            let count = 0, block = 0, empty = 0;
            
            for (let i = 0; i < len; i++) {
                if (line[i] === player) {
                    count++;
                } else if (line[i] === 0) {
                    if (count > 0) {
                        if (i - count - 1 >= 0 && line[i - count - 1] === opponent) block++;
                        score += evaluateGomokuPattern(count, block, empty);
                        count = 0;
                        block = 0;
                    }
                    empty = 1;
                } else {
                    if (count > 0) {
                        block++;
                        score += evaluateGomokuPattern(count, block, empty);
                        count = 0;
                        block = 0;
                    }
                    empty = 0;
                }
            }
            
            if (count > 0) {
                block++;
                score += evaluateGomokuPattern(count, block, empty);
            }
            
            return score;
        }

        function evaluateGomokuPattern(count, block, empty, space = 0) {
            if (count >= 5) return GOMOKU_SCORES.FIVE;
            // 两边都被堵住的棋型价值极低（死棋）
            if (block === 2) {
                return count >= 4 ? 10 : 0;
            }
            if (block === 0) {
                switch(count) {
                    case 4: return GOMOKU_SCORES.LIVE_FOUR;
                    case 3: return space > 0 ? GOMOKU_SCORES.JUMP_LIVE_THREE : GOMOKU_SCORES.LIVE_THREE;
                    case 2: return space > 0 ? GOMOKU_SCORES.JUMP_LIVE_TWO : GOMOKU_SCORES.LIVE_TWO;
                    case 1: return empty ? GOMOKU_SCORES.LIVE_ONE : 5;
                }
            } else if (block === 1) {
                switch(count) {
                    case 4: return GOMOKU_SCORES.RUSH_FOUR;
                    case 3: return GOMOKU_SCORES.SLEEP_THREE;
                    case 2: return GOMOKU_SCORES.SLEEP_TWO;
                    case 1: return 3;
                }
            }
            return 0;
        }
        
        // ========== 优化的棋型快速识别（使用位运算思想）=========
        // 扫描一条线上的棋型，返回详细信息
        function scanLinePattern(x, y, dx, dy, player) {
            const opponent = player === 1 ? 2 : 1;
            let line = [];
            
            // 向负方向扫描5格
            for (let i = 4; i >= 1; i--) {
                const nx = x - dx * i, ny = y - dy * i;
                if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                    line.push(-1); // 边界
                } else {
                    line.push(gomokuBoard[nx][ny]);
                }
            }
            
            // 当前位置
            line.push(player);
            
            // 向正方向扫描5格
            for (let i = 1; i <= 4; i++) {
                const nx = x + dx * i, ny = y + dy * i;
                if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                    line.push(-1);
                } else {
                    line.push(gomokuBoard[nx][ny]);
                }
            }
            
            // 分析这条线（9格，中心是4号索引）
            return analyzeLinePatternFast(line, player, opponent);
        }
        
        // 快速分析线型
        function analyzeLinePatternFast(line, player, opponent) {
            const center = 4;
            let result = {
                count: 1,
                block: 0,
                space: 0,
                type: 'none'
            };
            
            // 向左扫描
            let leftCount = 0, leftSpace = 0, leftBlock = false;
            for (let i = center - 1; i >= 0; i--) {
                if (line[i] === player) {
                    if (leftSpace === 0) leftCount++;
                    else leftCount++;
                } else if (line[i] === 0) {
                    if (leftSpace === 0 && leftCount > 0) {
                        leftSpace = 1;
                        if (i > 0 && line[i-1] === player) continue;
                    }
                    break;
                } else {
                    leftBlock = true;
                    break;
                }
            }
            
            // 向右扫描
            let rightCount = 0, rightSpace = 0, rightBlock = false;
            for (let i = center + 1; i < line.length; i++) {
                if (line[i] === player) {
                    if (rightSpace === 0) rightCount++;
                    else rightCount++;
                } else if (line[i] === 0) {
                    if (rightSpace === 0 && rightCount > 0) {
                        rightSpace = 1;
                        if (i < line.length - 1 && line[i+1] === player) continue;
                    }
                    break;
                } else {
                    rightBlock = true;
                    break;
                }
            }
            
            result.count = 1 + leftCount + rightCount;
            result.block = (leftBlock ? 1 : 0) + (rightBlock ? 1 : 0);
            result.space = leftSpace + rightSpace;
            
            // 判断棋型类型
            if (result.count >= 5) {
                result.type = 'five';
            } else if (result.count === 4) {
                result.type = result.block === 0 ? 'live_four' : (result.block === 1 ? 'rush_four' : 'dead_four');
            } else if (result.count === 3) {
                if (result.block === 0) {
                    result.type = result.space > 0 ? 'jump_live_three' : 'live_three';
                } else if (result.block === 1) {
                    result.type = 'sleep_three';
                }
            } else if (result.count === 2) {
                if (result.block === 0) {
                    result.type = result.space > 0 ? 'jump_live_two' : 'live_two';
                } else if (result.block === 1) {
                    result.type = 'sleep_two';
                }
            }
            
            return result;
        }

        // 分析单方向棋型，返回棋型类型（增强版：支持跳活识别）
        function analyzeDirectionPattern(x, y, dx, dy, player) {
            const opponent = player === 1 ? 2 : 1;
            let count = 1; // 包含当前落子点
            let block = 0;
            let jumpCount = 0; // 跳过空位后的连续棋子数
            let hasJump = false; // 是否有跳活
            
            // 正方向扫描（支持跳活）
            let foundEmpty = false;
            let emptyPos = 0;
            for (let i = 1; i <= 5; i++) {
                const nx = x + dx * i, ny = y + dy * i;
                if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                    if (!foundEmpty) block++;
                    break;
                }
                const cell = gomokuBoard[nx][ny];
                if (cell === player) {
                    if (foundEmpty) {
                        jumpCount++;
                        hasJump = true;
                    } else {
                        count++;
                    }
                } else if (cell === 0) {
                    if (!foundEmpty) {
                        foundEmpty = true;
                        emptyPos = i;
                    } else {
                        break; // 第二个空位，停止
                    }
                } else {
                    if (!foundEmpty) block++;
                    break;
                }
            }
            
            // 负方向扫描（支持跳活）
            let foundEmpty2 = false;
            let jumpCount2 = 0;
            for (let i = 1; i <= 5; i++) {
                const nx = x - dx * i, ny = y - dy * i;
                if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                    if (!foundEmpty2) block++;
                    break;
                }
                const cell = gomokuBoard[nx][ny];
                if (cell === player) {
                    if (foundEmpty2) {
                        jumpCount2++;
                        hasJump = true;
                    } else {
                        count++;
                    }
                } else if (cell === 0) {
                    if (!foundEmpty2) {
                        foundEmpty2 = true;
                    } else {
                        break;
                    }
                } else {
                    if (!foundEmpty2) block++;
                    break;
                }
            }
            
            // 计算有效棋子数（包含跳活）
            const effectiveCount = count + Math.max(jumpCount, jumpCount2);
            
            // 返回棋型信息
            return {
                count: count,
                effectiveCount: effectiveCount,
                block: block,
                hasJump: hasJump,
                jumpPieces: Math.max(jumpCount, jumpCount2),
                isLive: block === 0,
                isSleep: block === 1
            };
        }

        function evaluateGomokuPosition(x, y, player) {
            if (gomokuBoard[x][y] !== 0) return -1;
            
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            const opponent = player === 1 ? 2 : 1;
            let totalScore = 0;
            
            // 统计各种棋型数量
            let liveThreeCount = 0;
            let liveTwoCount = 0;
            let sleepThreeCount = 0;
            let rushFourCount = 0;
            
            gomokuBoard[x][y] = player;
            
            for (const [dx, dy] of directions) {
                // 检查该方向是否与己方棋子直接相连
                let connectedPositive = false;
                let connectedNegative = false;
                
                for (let i = 1; i <= 4; i++) {
                    const nx = x + dx * i, ny = y + dy * i;
                    if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) break;
                    if (gomokuBoard[nx][ny] === opponent) break;
                    if (gomokuBoard[nx][ny] === player) {
                        connectedPositive = true;
                        break;
                    }
                }
                
                for (let i = 1; i <= 4; i++) {
                    const nx = x - dx * i, ny = y - dy * i;
                    if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) break;
                    if (gomokuBoard[nx][ny] === opponent) break;
                    if (gomokuBoard[nx][ny] === player) {
                        connectedNegative = true;
                        break;
                    }
                }
                
                if (!connectedPositive && !connectedNegative) {
                    continue;
                }
                
                // 分析该方向的棋型
                const pattern = analyzeDirectionPattern(x, y, dx, dy, player);
                
                // 使用有效棋子数（包含跳活）来评估
                const effectiveCount = pattern.effectiveCount;
                
                // 统计棋型（考虑跳活）
                if (pattern.count >= 5 || effectiveCount >= 5) {
                    totalScore += GOMOKU_SCORES.FIVE;
                } else if (pattern.count === 4 || (effectiveCount >= 4 && pattern.hasJump)) {
                    if (pattern.isLive) {
                        totalScore += GOMOKU_SCORES.LIVE_FOUR;
                    } else if (pattern.isSleep || pattern.hasJump) {
                        rushFourCount++;
                        totalScore += GOMOKU_SCORES.RUSH_FOUR;
                    }
                } else if (pattern.count === 3 || (effectiveCount >= 3 && pattern.hasJump)) {
                    if (pattern.isLive) {
                        liveThreeCount++;
                        totalScore += GOMOKU_SCORES.LIVE_THREE;
                        // 跳活三额外加分
                        if (pattern.hasJump) {
                            totalScore += GOMOKU_SCORES.LIVE_THREE * 0.3;
                        }
                    } else if (pattern.isSleep) {
                        sleepThreeCount++;
                        totalScore += GOMOKU_SCORES.SLEEP_THREE;
                    }
                } else if (pattern.count === 2 || (effectiveCount >= 2 && pattern.hasJump)) {
                    if (pattern.isLive) {
                        liveTwoCount++;
                        totalScore += GOMOKU_SCORES.LIVE_TWO;
                        // 跳活二：开局时不加分（避免隔空防守），中后期才加分
                        if (pattern.hasJump && gomokuMoveHistory.length > 10) {
                            totalScore += GOMOKU_SCORES.LIVE_TWO * 0.3;
                        }
                    } else if (pattern.isSleep) {
                        totalScore += GOMOKU_SCORES.SLEEP_TWO;
                    }
                }
            }
            
            // ========== 组合棋型加分（核心改进）==========
            // 冲四+活三：必杀棋型（比双活三更强，因为冲四必须应）
            if (rushFourCount >= 1 && liveThreeCount >= 1) {
                totalScore += GOMOKU_SCORES.FOUR_THREE;
            }
            // 双活三：必杀棋型，对方无法同时防
            else if (liveThreeCount >= 2) {
                totalScore += GOMOKU_SCORES.DOUBLE_THREE;
            }
            // 双冲四：也是必杀（对方只能堵一个）
            if (rushFourCount >= 2) {
                totalScore += GOMOKU_SCORES.DOUBLE_THREE;
            }
            // 活三+睡三：有潜力形成双活三
            if (liveThreeCount >= 1 && sleepThreeCount >= 1) {
                totalScore += GOMOKU_SCORES.THREE_TWO_COMBO * 0.8;
            }
            // 活三+活二组合：进攻性很强
            if (liveThreeCount >= 1 && liveTwoCount >= 1) {
                totalScore += GOMOKU_SCORES.THREE_TWO_COMBO;
            }
            // 冲四+活二：有后续威胁
            if (rushFourCount >= 1 && liveTwoCount >= 1) {
                totalScore += GOMOKU_SCORES.THREE_TWO_COMBO * 0.6;
            }
            // 三活二及以上：极优选点（你提到的关键策略）
            if (liveTwoCount >= 3) {
                totalScore += GOMOKU_SCORES.TRIPLE_TWO;
            }
            // 双活二：优质选点
            else if (liveTwoCount >= 2) {
                totalScore += GOMOKU_SCORES.DOUBLE_TWO;
            }
            // 睡三+双活二：有发展作用
            if (sleepThreeCount >= 1 && liveTwoCount >= 2) {
                totalScore += GOMOKU_SCORES.DOUBLE_TWO * 0.5;
            }
            
            gomokuBoard[x][y] = 0;
            
            const centerDist = Math.abs(x - 7) + Math.abs(y - 7);
            totalScore += Math.max(0, (14 - centerDist)) * GOMOKU_SCORES.CENTER_BONUS;
            
            return totalScore;
        }

        function getGomokuCandidateMoves(updateDisplay = false, depth = 0) {
            const candidates = new Map();
            const checked = new Set();
            const opponent = gomokuCurrentPlayer === 1 ? 2 : 1;
            
            // 根据搜索深度动态调整搜索范围
            const searchRange = depth <= 1 ? 3 : 2;
            
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    if (gomokuBoard[x][y] !== 0) {
                        for (let dx = -searchRange; dx <= searchRange; dx++) {
                            for (let dy = -searchRange; dy <= searchRange; dy++) {
                                const nx = x + dx, ny = y + dy;
                                const key = `${nx},${ny}`;
                                
                                if (nx >= 0 && nx < GOMOKU_BOARD_SIZE && ny >= 0 && ny < GOMOKU_BOARD_SIZE && 
                                    gomokuBoard[nx][ny] === 0 && !checked.has(key)) {
                                    checked.add(key);
                                    
                                    const attackScore = evaluateGomokuPosition(nx, ny, gomokuCurrentPlayer);
                                    const defendScore = evaluateGomokuPosition(nx, ny, opponent);
                                    
                                    // ========== 优化的评分策略 ==========
                                    let totalScore = calculateMoveScore(attackScore, defendScore, nx, ny, gomokuCurrentPlayer, opponent);
                                    
                                    candidates.set(key, { x: nx, y: ny, score: totalScore, attackScore, defendScore });
                                }
                            }
                        }
                    }
                }
            }
            
            if (candidates.size === 0) {
                return [{ x: 7, y: 7, score: 0 }];
            }
            
            // 应用杀手启发：将杀手着法提前
            let sortedCandidates = Array.from(candidates.values());
            if (killerMoves[depth] && killerMoves[depth].length > 0) {
                sortedCandidates.sort((a, b) => {
                    const aIsKiller = killerMoves[depth].some(k => k.x === a.x && k.y === a.y);
                    const bIsKiller = killerMoves[depth].some(k => k.x === b.x && k.y === b.y);
                    if (aIsKiller && !bIsKiller) return -1;
                    if (!aIsKiller && bIsKiller) return 1;
                    return b.score - a.score;
                });
            } else {
                sortedCandidates.sort((a, b) => b.score - a.score);
            }
            
            sortedCandidates = sortedCandidates.slice(0, gomokuAiCandidateCount);
            
            if (updateDisplay && gomokuShowCandidates) {
                gomokuCurrentCandidates = sortedCandidates;
                drawGomokuBoard();
            }
            
            return sortedCandidates;
        }

        // ========== 优化的着法评分函数 ==========
        function calculateMoveScore(attackScore, defendScore, x, y, player, opponent) {
            let totalScore;
            
            // 必杀棋型优先级最高
            if (attackScore >= GOMOKU_SCORES.LIVE_FOUR) {
                return attackScore * 2;
            }
            if (defendScore >= GOMOKU_SCORES.LIVE_FOUR) {
                return defendScore * 1.8;
            }
            
            // 双冲四/冲四活三
            if (attackScore >= GOMOKU_SCORES.FOUR_THREE) {
                return attackScore * 1.6 + defendScore * 0.3;
            }
            if (defendScore >= GOMOKU_SCORES.FOUR_THREE) {
                return attackScore * 0.4 + defendScore * 1.5;
            }
            
            // 双活三
            if (attackScore >= GOMOKU_SCORES.DOUBLE_THREE) {
                return attackScore * 1.5 + defendScore * 0.4;
            }
            if (defendScore >= GOMOKU_SCORES.DOUBLE_THREE) {
                return attackScore * 0.5 + defendScore * 1.4;
            }
            
            // 冲四
            if (attackScore >= GOMOKU_SCORES.RUSH_FOUR) {
                totalScore = attackScore * 1.3 + defendScore * 0.6;
            }
            // 活三
            else if (attackScore >= GOMOKU_SCORES.LIVE_THREE) {
                if (defendScore >= GOMOKU_SCORES.LIVE_THREE) {
                    // 双方都能形成活三，进攻优先
                    totalScore = attackScore * 1.2 + defendScore * 0.9;
                } else {
                    totalScore = attackScore * 1.25 + defendScore * 0.7;
                }
            }
            // 对方活三
            else if (defendScore >= GOMOKU_SCORES.LIVE_THREE) {
                totalScore = attackScore * 0.6 + defendScore * 1.2;
            }
            // 常规情况
            else {
                totalScore = attackScore * 1.1 + defendScore * 0.9;
            }
            
            // 中心位置加分
            const centerDist = Math.abs(x - 7) + Math.abs(y - 7);
            totalScore += Math.max(0, (14 - centerDist)) * GOMOKU_SCORES.CENTER_BONUS;
            
            // 连接性加分
            totalScore += evaluateConnectivity(x, y, player) * GOMOKU_SCORES.CONNECTIVITY;
            
            return totalScore;
        }

        // ========== 评估点位的连接性 ==========
        function evaluateConnectivity(x, y, player) {
            let connectivity = 0;
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            
            for (const [dx, dy] of directions) {
                // 检查相邻位置是否有己方棋子
                for (let i = -2; i <= 2; i++) {
                    if (i === 0) continue;
                    const nx = x + dx * i, ny = y + dy * i;
                    if (nx >= 0 && nx < GOMOKU_BOARD_SIZE && ny >= 0 && ny < GOMOKU_BOARD_SIZE) {
                        if (gomokuBoard[nx][ny] === player) {
                            connectivity += Math.abs(i) === 1 ? 2 : 1;
                        }
                    }
                }
            }
            return connectivity;
        }

        // ========== 评估多方向威胁加分 ==========
        function evaluateMultiDirectionThreat(x, y, player) {
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            let threatDirections = 0;
            let potentialScore = 0;
            
            gomokuBoard[x][y] = player;
            
            for (const [dx, dy] of directions) {
                let count = 1;
                let space = 0;
                let block = 0;
                
                // 正方向
                for (let i = 1; i <= 4; i++) {
                    const nx = x + dx * i, ny = y + dy * i;
                    if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                        block++;
                        break;
                    }
                    if (gomokuBoard[nx][ny] === player) count++;
                    else if (gomokuBoard[nx][ny] === 0) { space++; break; }
                    else { block++; break; }
                }
                
                // 负方向
                for (let i = 1; i <= 4; i++) {
                    const nx = x - dx * i, ny = y - dy * i;
                    if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                        block++;
                        break;
                    }
                    if (gomokuBoard[nx][ny] === player) count++;
                    else if (gomokuBoard[nx][ny] === 0) { space++; break; }
                    else { block++; break; }
                }
                
                // 有威胁的方向（至少二连且有发展空间）
                if (count >= 2 && block < 2) {
                    threatDirections++;
                    potentialScore += count * 50;
                }
            }
            
            gomokuBoard[x][y] = 0;
            
            // 多方向威胁加分
            if (threatDirections >= 3) {
                return potentialScore + 800; // 三个方向都有威胁
            } else if (threatDirections >= 2) {
                return potentialScore + 400; // 两个方向有威胁
            }
            return potentialScore;
        }

        function gomokuMinimax(depth, alpha, beta, isMaximizing, startTime, originalDepth = null) {
            if (originalDepth === null) originalDepth = depth;
            
            // 超时检查
            if (Date.now() - startTime > gomokuAiThinkingLimit) {
                return { score: 0, timeout: true };
            }
            
            // 检查胜负
            if (gomokuMoveHistory.length > 0) {
                const last = gomokuMoveHistory[gomokuMoveHistory.length - 1];
                if (checkGomokuWin(last.x, last.y, last.player)) {
                    const winScore = GOMOKU_SCORES.FIVE + depth * 1000; // 越快获胜分数越高
                    return { score: isMaximizing ? -winScore : winScore };
                }
            }
            
            // 置换表查询
            const hashKey = currentZobristHash.toString();
            const ttEntry = gomokuTransTable.get(hashKey);
            if (ttEntry && ttEntry.depth >= depth) {
                if (ttEntry.flag === 'exact') {
                    return { score: ttEntry.score, move: ttEntry.move };
                } else if (ttEntry.flag === 'lower' && ttEntry.score > alpha) {
                    alpha = ttEntry.score;
                } else if (ttEntry.flag === 'upper' && ttEntry.score < beta) {
                    beta = ttEntry.score;
                }
                if (alpha >= beta) {
                    return { score: ttEntry.score, move: ttEntry.move };
                }
            }
            
            // 叶子节点评估
            if (depth === 0) {
                const score = evaluateGomokuBoard();
                return { score };
            }
            
            // 获取候选着法
            const candidates = getGomokuCandidateMoves(false, originalDepth - depth);
            
            if (candidates.length === 0) {
                return { score: 0 };
            }
            
            let bestMove = candidates[0];
            let bestScore = isMaximizing ? -Infinity : Infinity;
            let flag = 'upper';
            
            for (const move of candidates) {
                // 落子
                gomokuBoard[move.x][move.y] = gomokuCurrentPlayer;
                updateZobristHash(move.x, move.y, gomokuCurrentPlayer);
                gomokuMoveHistory.push({ x: move.x, y: move.y, player: gomokuCurrentPlayer });
                
                const prevPlayer = gomokuCurrentPlayer;
                gomokuCurrentPlayer = gomokuCurrentPlayer === 1 ? 2 : 1;
                
                // 递归搜索
                const result = gomokuMinimax(depth - 1, alpha, beta, !isMaximizing, startTime, originalDepth);
                
                // 撤销落子
                gomokuCurrentPlayer = prevPlayer;
                gomokuMoveHistory.pop();
                updateZobristHash(move.x, move.y, prevPlayer);
                gomokuBoard[move.x][move.y] = 0;
                
                if (result.timeout) return result;
                
                if (isMaximizing) {
                    if (result.score > bestScore) {
                        bestScore = result.score;
                        bestMove = move;
                    }
                    if (bestScore > alpha) {
                        alpha = bestScore;
                        flag = 'exact';
                    }
                } else {
                    if (result.score < bestScore) {
                        bestScore = result.score;
                        bestMove = move;
                    }
                    if (bestScore < beta) {
                        beta = bestScore;
                        flag = 'exact';
                    }
                }
                
                // Alpha-Beta剪枝
                if (alpha >= beta) {
                    // 记录杀手着法
                    if (killerMoves[originalDepth - depth]) {
                        const km = killerMoves[originalDepth - depth];
                        if (!km.some(k => k.x === move.x && k.y === move.y)) {
                            km.unshift({ x: move.x, y: move.y });
                            if (km.length > KILLER_MOVE_SLOTS) km.pop();
                        }
                    }
                    flag = isMaximizing ? 'lower' : 'upper';
                    break;
                }
            }
            
            // 存入置换表
            if (gomokuTransTable.size < TRANS_TABLE_MAX_SIZE) {
                gomokuTransTable.set(hashKey, {
                    depth,
                    score: bestScore,
                    flag,
                    move: bestMove
                });
            }
            
            return { score: bestScore, move: bestMove };
        }

        // ========== 迭代加深搜索 ==========
        function iterativeDeepeningSearch(maxDepth, timeLimit) {
            const startTime = Date.now();
            let bestResult = null;
            
            for (let depth = 1; depth <= maxDepth; depth++) {
                const result = gomokuMinimax(depth, -Infinity, Infinity, true, startTime, depth);
                
                if (result.timeout) {
                    break;
                }
                
                bestResult = result;
                
                // 如果找到必胜，提前结束
                if (result.score >= GOMOKU_SCORES.VCF_WIN) {
                    break;
                }
                
                // 时间检查
                if (Date.now() - startTime > timeLimit * 0.7) {
                    break;
                }
            }
            
            return bestResult;
        }

        // ========== 优化的棋盘评估函数 ==========
        function evaluateGomokuBoard() {
            const aiPlayer = gomokuPlayerRole === 1 ? 2 : 1;
            const humanPlayer = gomokuPlayerRole;
            
            // 使用线扫描评估，更高效率
            let aiScore = 0, humanScore = 0;
            let aiThreats = { five: 0, liveFour: 0, rushFour: 0, liveThree: 0, sleepThree: 0, liveTwo: 0 };
            let humanThreats = { five: 0, liveFour: 0, rushFour: 0, liveThree: 0, sleepThree: 0, liveTwo: 0 };
            
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            const evaluated = new Set();
            
            // 只评估有棋子的位置周围
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    const cell = gomokuBoard[x][y];
                    if (cell === 0) continue;
                    
                    const player = cell;
                    const threats = player === aiPlayer ? aiThreats : humanThreats;
                    
                    for (const [dx, dy] of directions) {
                        // 避免重复评估同一条线
                        const lineKey = `${x},${y},${dx},${dy}`;
                        if (evaluated.has(lineKey)) continue;
                        
                        // 标记这条线已评估
                        for (let i = -4; i <= 4; i++) {
                            const nx = x + dx * i, ny = y + dy * i;
                            if (nx >= 0 && nx < GOMOKU_BOARD_SIZE && ny >= 0 && ny < GOMOKU_BOARD_SIZE) {
                                evaluated.add(`${nx},${ny},${dx},${dy}`);
                            }
                        }
                        
                        // 分析这个方向的棋型
                        const pattern = analyzeDirectionPattern(x, y, dx, dy, player);
                        
                        // 统计威胁
                        if (pattern.count >= 5) threats.five++;
                        else if (pattern.count === 4 && pattern.isLive) threats.liveFour++;
                        else if (pattern.count === 4 && pattern.isSleep) threats.rushFour++;
                        else if (pattern.count === 3 && pattern.isLive) threats.liveThree++;
                        else if (pattern.count === 3 && pattern.isSleep) threats.sleepThree++;
                        else if (pattern.count === 2 && pattern.isLive) threats.liveTwo++;
                    }
                }
            }
            
            // 计算分数
            aiScore = aiThreats.five * GOMOKU_SCORES.FIVE +
                    aiThreats.liveFour * GOMOKU_SCORES.LIVE_FOUR +
                    aiThreats.rushFour * GOMOKU_SCORES.RUSH_FOUR +
                    aiThreats.liveThree * GOMOKU_SCORES.LIVE_THREE +
                    aiThreats.sleepThree * GOMOKU_SCORES.SLEEP_THREE +
                    aiThreats.liveTwo * GOMOKU_SCORES.LIVE_TWO;
            
            humanScore = humanThreats.five * GOMOKU_SCORES.FIVE +
                        humanThreats.liveFour * GOMOKU_SCORES.LIVE_FOUR +
                        humanThreats.rushFour * GOMOKU_SCORES.RUSH_FOUR +
                        humanThreats.liveThree * GOMOKU_SCORES.LIVE_THREE +
                        humanThreats.sleepThree * GOMOKU_SCORES.SLEEP_THREE +
                        humanThreats.liveTwo * GOMOKU_SCORES.LIVE_TWO;
            
            // 组合棋型加分
            if (aiThreats.liveThree >= 2) aiScore += GOMOKU_SCORES.DOUBLE_THREE;
            if (aiThreats.rushFour >= 1 && aiThreats.liveThree >= 1) aiScore += GOMOKU_SCORES.FOUR_THREE;
            if (aiThreats.rushFour >= 2) aiScore += GOMOKU_SCORES.DOUBLE_FOUR;
            
            if (humanThreats.liveThree >= 2) humanScore += GOMOKU_SCORES.DOUBLE_THREE;
            if (humanThreats.rushFour >= 1 && humanThreats.liveThree >= 1) humanScore += GOMOKU_SCORES.FOUR_THREE;
            if (humanThreats.rushFour >= 2) humanScore += GOMOKU_SCORES.DOUBLE_FOUR;
            
            // 进攻主动分
            const aiThreatLevel = aiThreats.liveFour * 10 + aiThreats.rushFour * 5 + aiThreats.liveThree * 2 + aiThreats.liveTwo;
            const humanThreatLevel = humanThreats.liveFour * 10 + humanThreats.rushFour * 5 + humanThreats.liveThree * 2 + humanThreats.liveTwo;
            
            return (aiScore - humanScore) + (aiThreatLevel - humanThreatLevel) * 100;
        }

        // ========== 获取指定玩家的冲四点（形成四连的落子点）==========
        function getRushFourMoves(player) {
            const moves = [];
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    if (gomokuBoard[x][y] !== 0) continue;
                    
                    // 临时落子
                    gomokuBoard[x][y] = player;
                    
                    for (const [dx, dy] of directions) {
                        let count = 1;
                        let block = 0;
                        
                        // 正方向
                        for (let i = 1; i <= 4; i++) {
                            const nx = x + dx * i, ny = y + dy * i;
                            if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                                block++;
                                break;
                            }
                            if (gomokuBoard[nx][ny] === player) count++;
                            else if (gomokuBoard[nx][ny] === 0) break;
                            else { block++; break; }
                        }
                        
                        // 负方向
                        for (let i = 1; i <= 4; i++) {
                            const nx = x - dx * i, ny = y - dy * i;
                            if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                                block++;
                                break;
                            }
                            if (gomokuBoard[nx][ny] === player) count++;
                            else if (gomokuBoard[nx][ny] === 0) break;
                            else { block++; break; }
                        }
                        
                        // 形成四连（冲四或活四）
                        if (count >= 4 && block < 2) {
                            moves.push({ x, y, isLiveFour: block === 0 });
                            break;
                        }
                    }
                    
                    gomokuBoard[x][y] = 0;
                }
            }
            return moves;
        }

        // ========== 获取指定玩家的活三点 ==========
        function getLiveThreeMoves(player) {
            const moves = [];
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    if (gomokuBoard[x][y] !== 0) continue;
                    
                    gomokuBoard[x][y] = player;
                    let liveThreeCount = 0;
                    
                    for (const [dx, dy] of directions) {
                        let count = 1;
                        let block = 0;
                        let space1 = 0, space2 = 0;
                        
                        // 正方向扫描
                        for (let i = 1; i <= 4; i++) {
                            const nx = x + dx * i, ny = y + dy * i;
                            if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                                block++;
                                break;
                            }
                            if (gomokuBoard[nx][ny] === player) count++;
                            else if (gomokuBoard[nx][ny] === 0) { space1++; break; }
                            else { block++; break; }
                        }
                        
                        // 负方向扫描
                        for (let i = 1; i <= 4; i++) {
                            const nx = x - dx * i, ny = y - dy * i;
                            if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) {
                                block++;
                                break;
                            }
                            if (gomokuBoard[nx][ny] === player) count++;
                            else if (gomokuBoard[nx][ny] === 0) { space2++; break; }
                            else { block++; break; }
                        }
                        
                        // 活三：三连且两端都有空位
                        if (count === 3 && block === 0 && space1 > 0 && space2 > 0) {
                            liveThreeCount++;
                        }
                    }
                    
                    if (liveThreeCount > 0) {
                        moves.push({ x, y, liveThreeCount });
                    }
                    
                    gomokuBoard[x][y] = 0;
                }
            }
            return moves;
        }

        // ========== 找到对方已存在的活三（棋盘上已有的三连，包括跳活三）==========
        function findOpponentLiveThrees(opponent) {
            const liveThrees = [];
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            const foundThrees = new Set(); // 用于去重，存储活三的唯一标识
            
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    if (gomokuBoard[x][y] !== opponent) continue;
                    
                    for (const [dx, dy] of directions) {
                        // 检查这个方向是否形成活三（包括跳活三）
                        const result = checkLiveThreeInDirection(x, y, dx, dy, opponent);
                        if (result) {
                            // 使用活三的所有棋子位置作为唯一标识
                            const piecesKey = result.pieces
                                .map(p => `${p.x},${p.y}`)
                                .sort()
                                .join('|');
                            const threeKey = `${piecesKey}:${dx},${dy}`;
                            
                            if (!foundThrees.has(threeKey)) {
                                foundThrees.add(threeKey);
                                liveThrees.push(result);
                            }
                        }
                    }
                }
            }
            return liveThrees;
        }

        // ========== 检查某方向是否存在活三，返回活三信息（增强版：支持跳活三）==========
        function checkLiveThreeInDirection(startX, startY, dx, dy, player) {
            // 向负方向找到起点（跳过空位继续找）
            let x = startX, y = startY;
            while (x - dx >= 0 && x - dx < GOMOKU_BOARD_SIZE && 
                y - dy >= 0 && y - dy < GOMOKU_BOARD_SIZE && 
                gomokuBoard[x - dx][y - dy] === player) {
                x -= dx;
                y -= dy;
            }
            
            // 从起点开始统计连续棋子
            const pieces = [];
            let tx = x, ty = y;
            while (tx >= 0 && tx < GOMOKU_BOARD_SIZE && ty >= 0 && ty < GOMOKU_BOARD_SIZE && gomokuBoard[tx][ty] === player) {
                pieces.push({ x: tx, y: ty });
                tx += dx;
                ty += dy;
            }
            
            // 检查两端是否都是空位（活三条件）
            const beforeX = x - dx, beforeY = y - dy;
            const afterX = tx, afterY = ty;
            
            const beforeEmpty = beforeX >= 0 && beforeX < GOMOKU_BOARD_SIZE && 
                            beforeY >= 0 && beforeY < GOMOKU_BOARD_SIZE && 
                            gomokuBoard[beforeX][beforeY] === 0;
            const afterEmpty = afterX >= 0 && afterX < GOMOKU_BOARD_SIZE && 
                            afterY >= 0 && afterY < GOMOKU_BOARD_SIZE && 
                            gomokuBoard[afterX][afterY] === 0;
            
            // 连续三连活三：●●●○
            if (pieces.length === 3 && beforeEmpty && afterEmpty) {
                return {
                    pieces: pieces,
                    blockPoints: [
                        { x: beforeX, y: beforeY },
                        { x: afterX, y: afterY }
                    ],
                    dx, dy,
                    isJump: false
                };
            }
            
            // 检查跳活三：●●○● 或 ●○●●
            // 情况1：连续两子后有空位再有一子
            if (pieces.length === 2 && afterEmpty) {
                // 检查空位后是否还有一个己方棋子
                const jumpX = afterX + dx, jumpY = afterY + dy;
                if (jumpX >= 0 && jumpX < GOMOKU_BOARD_SIZE && 
                    jumpY >= 0 && jumpY < GOMOKU_BOARD_SIZE && 
                    gomokuBoard[jumpX][jumpY] === player) {
                    // 检查跳活三后面是否有空位
                    const afterJumpX = jumpX + dx, afterJumpY = jumpY + dy;
                    const afterJumpEmpty = afterJumpX >= 0 && afterJumpX < GOMOKU_BOARD_SIZE && 
                                        afterJumpY >= 0 && afterJumpY < GOMOKU_BOARD_SIZE && 
                                        gomokuBoard[afterJumpX][afterJumpY] === 0;
                    
                    // 跳活三：两端都有空位（前端空位 + 中间空位可以形成四连）
                    if (beforeEmpty && afterJumpEmpty) {
                        return {
                            pieces: [...pieces, { x: jumpX, y: jumpY }],
                            blockPoints: [
                                { x: beforeX, y: beforeY },
                                { x: afterX, y: afterY },  // 中间的空位是关键防守点
                                { x: afterJumpX, y: afterJumpY }
                            ],
                            dx, dy,
                            isJump: true,
                            jumpEmptyPos: { x: afterX, y: afterY }
                        };
                    }
                    // 跳活三变体：前端空位 + 中间空位（即使后面被堵也是活三）
                    if (beforeEmpty) {
                        return {
                            pieces: [...pieces, { x: jumpX, y: jumpY }],
                            blockPoints: [
                                { x: beforeX, y: beforeY },
                                { x: afterX, y: afterY }  // 中间的空位是关键防守点
                            ],
                            dx, dy,
                            isJump: true,
                            jumpEmptyPos: { x: afterX, y: afterY }
                        };
                    }
                }
            }
            
            // 情况2：一子后有空位再有两子●○●●
            if (pieces.length === 1 && afterEmpty) {
                const jumpX = afterX + dx, jumpY = afterY + dy;
                if (jumpX >= 0 && jumpX < GOMOKU_BOARD_SIZE && 
                    jumpY >= 0 && jumpY < GOMOKU_BOARD_SIZE && 
                    gomokuBoard[jumpX][jumpY] === player) {
                    // 检查是否有连续两子
                    const jump2X = jumpX + dx, jump2Y = jumpY + dy;
                    if (jump2X >= 0 && jump2X < GOMOKU_BOARD_SIZE && 
                        jump2Y >= 0 && jump2Y < GOMOKU_BOARD_SIZE && 
                        gomokuBoard[jump2X][jump2Y] === player) {
                        // 检查后端是否有空位
                        const afterJump2X = jump2X + dx, afterJump2Y = jump2Y + dy;
                        const afterJump2Empty = afterJump2X >= 0 && afterJump2X < GOMOKU_BOARD_SIZE && 
                                            afterJump2Y >= 0 && afterJump2Y < GOMOKU_BOARD_SIZE && 
                                            gomokuBoard[afterJump2X][afterJump2Y] === 0;
                        
                        if (beforeEmpty && afterJump2Empty) {
                            return {
                                pieces: [...pieces, { x: jumpX, y: jumpY }, { x: jump2X, y: jump2Y }],
                                blockPoints: [
                                    { x: beforeX, y: beforeY },
                                    { x: afterX, y: afterY },  // 中间的空位是关键防守点
                                    { x: afterJump2X, y: afterJump2Y }
                                ],
                                dx, dy,
                                isJump: true,
                                jumpEmptyPos: { x: afterX, y: afterY }
                            };
                        }
                        if (beforeEmpty) {
                            return {
                                pieces: [...pieces, { x: jumpX, y: jumpY }, { x: jump2X, y: jump2Y }],
                                blockPoints: [
                                    { x: beforeX, y: beforeY },
                                    { x: afterX, y: afterY }  // 中间的空位是关键防守点
                                ],
                                dx, dy,
                                isJump: true,
                                jumpEmptyPos: { x: afterX, y: afterY }
                            };
                        }
                    }
                }
            }
            
            return null;
        }

        // ========== 找到防守活三的最佳位置（直接堵住，不隔格）==========
        function findBestLiveThreeBlock(liveThrees, candidates, opponent) {
            if (liveThrees.length === 0) return null;
            
            // 收集所有活三的直接防守点
            const directBlockPoints = [];
            for (const three of liveThrees) {
                for (const block of three.blockPoints) {
                    if (gomokuBoard[block.x][block.y] !== 0) continue;
                    
                    // 验证这确实是活三的防守点（落子后能阻止活三变成活四）
                    gomokuBoard[block.x][block.y] = gomokuCurrentPlayer;
                    
                    // 检查落子后对方这个活三是否被阻止
                    let blocked = true;
                    for (const piece of three.pieces) {
                        const pattern = analyzeDirectionPattern(piece.x, piece.y, three.dx, three.dy, opponent);
                        // 检查是否还能形成活三或跳活三
                        if ((pattern.count >= 3 || pattern.effectiveCount >= 3) && pattern.isLive) {
                            blocked = false;
                            break;
                        }
                    }
                    
                    // 同时评估这个点的进攻价值
                    const attackValue = evaluateGomokuPosition(block.x, block.y, gomokuCurrentPlayer);
                    
                    gomokuBoard[block.x][block.y] = 0;
                    
                    if (blocked) {
                        // 跳活三的中间空位是最佳防守点，给予额外加分
                        let bonusScore = 10000;
                        if (three.isJump && three.jumpEmptyPos && 
                            block.x === three.jumpEmptyPos.x && block.y === three.jumpEmptyPos.y) {
                            bonusScore = 15000; // 跳活三中间空位优先级更高
                        }
                        
                        directBlockPoints.push({
                            x: block.x,
                            y: block.y,
                            score: attackValue + bonusScore,
                            isDirectBlock: true,
                            isJumpMiddle: three.isJump && three.jumpEmptyPos && 
                                        block.x === three.jumpEmptyPos.x && block.y === three.jumpEmptyPos.y
                        });
                    }
                }
            }
            
            if (directBlockPoints.length > 0) {
                // 选择得分最高的直接防守点
                directBlockPoints.sort((a, b) => b.score - a.score);
                return directBlockPoints[0];
            }
            
            return null;
        }

        // ========== 找到对方已存在的活二 ==========
        function findOpponentLiveTwos(opponent) {
            const liveTwos = [];
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            const checked = new Set();
            
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    if (gomokuBoard[x][y] !== opponent) continue;
                    
                    for (const [dx, dy] of directions) {
                        const key = `${Math.min(x, x + dx)},${Math.min(y, y + dy)},${dx},${dy}`;
                        if (checked.has(key)) continue;
                        checked.add(key);
                        
                        const result = checkLiveTwoInDirection(x, y, dx, dy, opponent);
                        if (result) {
                            liveTwos.push(result);
                        }
                    }
                }
            }
            return liveTwos;
        }

        // ========== 检查某方向是否存在活二 ==========
        function checkLiveTwoInDirection(startX, startY, dx, dy, player) {
            // 向负方向找到起点
            let x = startX, y = startY;
            while (x - dx >= 0 && x - dx < GOMOKU_BOARD_SIZE && 
                y - dy >= 0 && y - dy < GOMOKU_BOARD_SIZE && 
                gomokuBoard[x - dx][y - dy] === player) {
                x -= dx;
                y -= dy;
            }
            
            // 从起点开始统计连续棋子
            const pieces = [];
            let tx = x, ty = y;
            while (tx >= 0 && tx < GOMOKU_BOARD_SIZE && ty >= 0 && ty < GOMOKU_BOARD_SIZE && gomokuBoard[tx][ty] === player) {
                pieces.push({ x: tx, y: ty });
                tx += dx;
                ty += dy;
            }
            
            // 必须是二连
            if (pieces.length !== 2) return null;
            
            // 检查两端是否都是空位（活二条件）
            const beforeX = x - dx, beforeY = y - dy;
            const afterX = tx, afterY = ty;
            
            const beforeEmpty = beforeX >= 0 && beforeX < GOMOKU_BOARD_SIZE && 
                            beforeY >= 0 && beforeY < GOMOKU_BOARD_SIZE && 
                            gomokuBoard[beforeX][beforeY] === 0;
            const afterEmpty = afterX >= 0 && afterX < GOMOKU_BOARD_SIZE && 
                            afterY >= 0 && afterY < GOMOKU_BOARD_SIZE && 
                            gomokuBoard[afterX][afterY] === 0;
            
            if (!beforeEmpty || !afterEmpty) return null;
            
            // 返回活二信息，包括两端的直接防守点
            return {
                pieces: pieces,
                blockPoints: [
                    { x: beforeX, y: beforeY },
                    { x: afterX, y: afterY }
                ],
                dx, dy
            };
        }

        // ========== 找到防守活二的最佳位置（直接堵住，不隔格）==========
        function findBestLiveTwoBlock(liveTwos, candidates, opponent) {
            if (liveTwos.length === 0) return null;
            
            // 收集所有活二的直接防守点（只考虑活二两端的空位）
            const directBlockPoints = [];
            for (const two of liveTwos) {
                for (const block of two.blockPoints) {
                    if (gomokuBoard[block.x][block.y] !== 0) continue;
                    
                    // 验证这确实是活二的防守点
                    gomokuBoard[block.x][block.y] = gomokuCurrentPlayer;
                    
                    // 检查落子后对方这个活二是否被阻止
                    let blocked = true;
                    for (const piece of two.pieces) {
                        const pattern = analyzeDirectionPattern(piece.x, piece.y, two.dx, two.dy, opponent);
                        if (pattern.count >= 2 && pattern.isLive) {
                            blocked = false;
                            break;
                        }
                    }
                    
                    // 同时评估这个点的进攻价值
                    const attackValue = evaluateGomokuPosition(block.x, block.y, gomokuCurrentPlayer);
                    
                    gomokuBoard[block.x][block.y] = 0;
                    
                    if (blocked) {
                        directBlockPoints.push({
                            x: block.x,
                            y: block.y,
                            score: attackValue + 5000, // 活二防守点基础分
                            isDirectBlock: true
                        });
                    }
                }
            }
            
            if (directBlockPoints.length > 0) {
                // 选择得分最高的直接防守点
                directBlockPoints.sort((a, b) => b.score - a.score);
                return directBlockPoints[0];
            }
            
            return null;
        }

        // ========== 获取防守冲四的必须应点 ==========
        function getDefendFourMoves(player) {
            const opponent = player === 1 ? 2 : 1;
            const opponentFours = getRushFourMoves(opponent);
            const defendMoves = [];
            
            for (const four of opponentFours) {
                // 如果是活四，只能堵一边（通常无法防守）
                if (four.isLiveFour) continue;
                
                // 找到能阻止这个冲四的点
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
                for (const [dx, dy] of directions) {
                    for (let i = -4; i <= 4; i++) {
                        if (i === 0) continue;
                        const nx = four.x + dx * i, ny = four.y + dy * i;
                        if (nx >= 0 && nx < GOMOKU_BOARD_SIZE && ny >= 0 && ny < GOMOKU_BOARD_SIZE && gomokuBoard[nx][ny] === 0) {
                            defendMoves.push({ x: nx, y: ny });
                        }
                    }
                }
            }
            return defendMoves;
        }

        // ========== VCF搜索：连续冲四必胜搜索 ==========
        // VCF搜索缓存
        const vcfCache = new Map();
        const VCF_CACHE_MAX = 50000;

        function vcfSearch(player, depth, isAttacker) {
            if (depth <= 0) return null;
            
            // 缓存查询
            const cacheKey = `${currentZobristHash.toString()}_${player}_${isAttacker}`;
            if (vcfCache.has(cacheKey)) {
                const cached = vcfCache.get(cacheKey);
                if (cached.depth >= depth) return cached.result;
            }
            
            const opponent = player === 1 ? 2 : 1;
            let result = null;
            
            if (isAttacker) {
                // 进攻方：寻找冲四点
                const fourMoves = getRushFourMoves(player);
                
                // 优先检查活四（必胜）
                for (const move of fourMoves) {
                    if (move.isLiveFour) {
                        result = { x: move.x, y: move.y, sequence: [{ x: move.x, y: move.y }] };
                        break;
                    }
                }
                
                if (!result) {
                    for (const move of fourMoves) {
                        gomokuBoard[move.x][move.y] = player;
                        updateZobristHash(move.x, move.y, player);
                        
                        // 检查是否直接获胜
                        if (checkGomokuWin(move.x, move.y, player)) {
                            updateZobristHash(move.x, move.y, player);
                            gomokuBoard[move.x][move.y] = 0;
                            result = { x: move.x, y: move.y, sequence: [{ x: move.x, y: move.y }] };
                            break;
                        }
                        
                        // 递归搜索对手防守后的情况
                        const subResult = vcfSearch(opponent, depth - 1, false);
                        
                        updateZobristHash(move.x, move.y, player);
                        gomokuBoard[move.x][move.y] = 0;
                        
                        if (subResult) {
                            result = { x: move.x, y: move.y, sequence: [{ x: move.x, y: move.y }, ...subResult.sequence] };
                            break;
                        }
                    }
                }
            } else {
                // 防守方：必须堵住冲四
                const attackerFours = getRushFourMoves(opponent);
                
                if (attackerFours.length > 0) {
                    // 找到必须防守的点
                    for (const four of attackerFours) {
                        const blockPoints = findBlockPoints(four.x, four.y, opponent);
                        
                        if (blockPoints.length === 0) {
                            result = { x: four.x, y: four.y, sequence: [] };
                            break;
                        }
                        
                        // 尝试每个防守点
                        let canDefend = false;
                        for (const block of blockPoints) {
                            gomokuBoard[block.x][block.y] = player;
                            updateZobristHash(block.x, block.y, player);
                            
                            const subResult = vcfSearch(opponent, depth - 1, true);
                            
                            updateZobristHash(block.x, block.y, player);
                            gomokuBoard[block.x][block.y] = 0;
                            
                            if (!subResult) {
                                canDefend = true;
                                break;
                            }
                        }
                        
                        if (!canDefend) {
                            result = { x: four.x, y: four.y, sequence: [] };
                            break;
                        }
                    }
                }
            }
            
            // 存入缓存
            if (vcfCache.size < VCF_CACHE_MAX) {
                vcfCache.set(cacheKey, { depth, result });
            }
            
            return result;
        }

        // ========== 找到阻止冲四成五的点 ==========
        function findBlockPoints(x, y, player) {
            const blockPoints = [];
            const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            
            gomokuBoard[x][y] = player;
            
            for (const [dx, dy] of directions) {
                let count = 1;
                const emptyPoints = [];
                
                // 正方向
                for (let i = 1; i <= 4; i++) {
                    const nx = x + dx * i, ny = y + dy * i;
                    if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) break;
                    if (gomokuBoard[nx][ny] === player) count++;
                    else if (gomokuBoard[nx][ny] === 0) {
                        emptyPoints.push({ x: nx, y: ny });
                        break;
                    } else break;
                }
                
                // 负方向
                for (let i = 1; i <= 4; i++) {
                    const nx = x - dx * i, ny = y - dy * i;
                    if (nx < 0 || nx >= GOMOKU_BOARD_SIZE || ny < 0 || ny >= GOMOKU_BOARD_SIZE) break;
                    if (gomokuBoard[nx][ny] === player) count++;
                    else if (gomokuBoard[nx][ny] === 0) {
                        emptyPoints.push({ x: nx, y: ny });
                        break;
                    } else break;
                }
                
                // 如果这个方向形成四连，空位就是防守点
                if (count >= 4) {
                    blockPoints.push(...emptyPoints);
                }
            }
            
            gomokuBoard[x][y] = 0;
            return blockPoints;
        }

        // ========== VCT搜索：连续活三必胜搜索 ==========
        function vctSearch(player, depth, isAttacker) {
            if (depth <= 0) return null;
            
            const opponent = player === 1 ? 2 : 1;
            
            // 先检查VCF
            const vcfResult = vcfSearch(player, VCF_MAX_DEPTH, true);
            if (vcfResult) return vcfResult;
            
            if (isAttacker) {
                // 获取活三点和冲四点
                const threeMoves = getLiveThreeMoves(player);
                const fourMoves = getRushFourMoves(player);
                
                // 优先检查冲四活三组合
                for (const move of fourMoves) {
                    gomokuBoard[move.x][move.y] = player;
                    
                    // 检查是否同时形成活三
                    const newThrees = getLiveThreeMoves(player);
                    const hasLiveThree = newThrees.length > 0;
                    
                    if (hasLiveThree || move.isLiveFour) {
                        // 冲四活三或活四，必胜
                        gomokuBoard[move.x][move.y] = 0;
                        return { x: move.x, y: move.y, sequence: [{ x: move.x, y: move.y }] };
                    }
                    
                    gomokuBoard[move.x][move.y] = 0;
                }
                
                // 尝试活三进攻
                for (const move of threeMoves) {
                    // 双活三必胜
                    if (move.liveThreeCount >= 2) {
                        return { x: move.x, y: move.y, sequence: [{ x: move.x, y: move.y }] };
                    }
                    
                    gomokuBoard[move.x][move.y] = player;
                    
                    // 递归搜索
                    const result = vctSearch(player, depth - 1, true);
                    gomokuBoard[move.x][move.y] = 0;
                    
                    if (result) {
                        return { x: move.x, y: move.y, sequence: [{ x: move.x, y: move.y }, ...result.sequence] };
                    }
                }
                
                return null;
            }
            
            return null;
        }

        // ========== 威胁空间搜索：检测多步攻杀 ==========
        function threatSearch(player, depth) {
            if (depth <= 0) return null;
            
            const opponent = player === 1 ? 2 : 1;
            
            // 获取所有高威胁点
            const candidates = [];
            
            for (let x = 0; x < GOMOKU_BOARD_SIZE; x++) {
                for (let y = 0; y < GOMOKU_BOARD_SIZE; y++) {
                    if (gomokuBoard[x][y] !== 0) continue;
                    
                    const score = evaluateGomokuPosition(x, y, player);
                    if (score >= GOMOKU_SCORES.LIVE_THREE) {
                        candidates.push({ x, y, score });
                    }
                }
            }
            
            candidates.sort((a, b) => b.score - a.score);
            
            for (const move of candidates.slice(0, 10)) {
                gomokuBoard[move.x][move.y] = player;
                
                // 检查是否获胜
                if (checkGomokuWin(move.x, move.y, player)) {
                    gomokuBoard[move.x][move.y] = 0;
                    return move;
                }
                
                // 检查是否形成必杀局面
                const attackScore = evaluateGomokuPosition(move.x, move.y, player);
                if (attackScore >= GOMOKU_SCORES.DOUBLE_THREE) {
                    // 检查对手能否防守
                    let canDefend = false;
                    const defendMoves = getDefendFourMoves(player);
                    
                    for (const defend of defendMoves) {
                        gomokuBoard[defend.x][defend.y] = opponent;
                        const afterDefend = threatSearch(player, depth - 1);
                        gomokuBoard[defend.x][defend.y] = 0;
                        
                        if (!afterDefend) {
                            canDefend = true;
                            break;
                        }
                    }
                    
                    if (!canDefend) {
                        gomokuBoard[move.x][move.y] = 0;
                        return move;
                    }
                }
                
                gomokuBoard[move.x][move.y] = 0;
            }
            
            return null;
        }

        // ========== 找到阻止对方VCF/VCT的最佳防守点 ==========
        function findBestBlockMove(attacker, attackPath, candidates) {
            const defender = attacker === 1 ? 2 : 1;
            
            if (!attackPath || !attackPath.sequence || attackPath.sequence.length === 0) {
                return null;
            }
            
            // 策略1：直接占据对方攻杀路径上的关键点
            const attackFirstMove = attackPath.sequence[0];
            if (attackFirstMove && gomokuBoard[attackFirstMove.x][attackFirstMove.y] === 0) {
                // 检查占据这个点后对方是否还能VCF
                gomokuBoard[attackFirstMove.x][attackFirstMove.y] = defender;
                const stillWin = vcfSearch(attacker, VCF_MAX_DEPTH, true);
                gomokuBoard[attackFirstMove.x][attackFirstMove.y] = 0;
                
                if (!stillWin) {
                    return { x: attackFirstMove.x, y: attackFirstMove.y };
                }
            }
            
            // 策略2：尝试所有候选点，找到能阻止对方VCF的点
            const blockCandidates = [];
            
            for (const move of candidates) {
                gomokuBoard[move.x][move.y] = defender;
                
                // 检查落子后对方是否还能VCF获胜
                const opponentVcf = vcfSearch(attacker, VCF_MAX_DEPTH, true);
                
                if (!opponentVcf) {
                    // 这个点能阻止对方VCF
                    // 同时评估这个点的进攻价值
                    const attackValue = evaluateGomokuPosition(move.x, move.y, defender);
                    blockCandidates.push({ ...move, blockScore: move.score + attackValue * 0.5 });
                }
                
                gomokuBoard[move.x][move.y] = 0;
            }
            
            if (blockCandidates.length > 0) {
                // 选择防守价值最高的点（同时考虑进攻价值）
                blockCandidates.sort((a, b) => b.blockScore - a.blockScore);
                return blockCandidates[0];
            }
            
            // 策略3：如果候选点都不能完全阻止，尝试找到能延缓对方攻杀的点
            // 优先选择能形成自己威胁的防守点（攻防兼备）
            for (const move of candidates) {
                gomokuBoard[move.x][move.y] = defender;
                
                // 检查是否能形成自己的威胁
                const defenderThreats = getLiveThreeMoves(defender);
                const defenderFours = getRushFourMoves(defender);
                
                gomokuBoard[move.x][move.y] = 0;
                
                // 如果防守的同时能形成威胁，优先选择
                if (defenderFours.length > 0 || defenderThreats.length > 0) {
                    return move;
                }
            }
            
            // 策略4：找到对方攻杀路径中的关键阻断点
            // 分析对方的冲四点，找到能阻止最多冲四的位置
            const attackerFours = getRushFourMoves(attacker);
            if (attackerFours.length > 0) {
                // 找到能阻止对方冲四的点
                for (const four of attackerFours) {
                    const blockPoints = findBlockPoints(four.x, four.y, attacker);
                    for (const block of blockPoints) {
                        // 检查这个阻断点是否在候选列表中
                        const inCandidates = candidates.find(c => c.x === block.x && c.y === block.y);
                        if (inCandidates) {
                            return inCandidates;
                        }
                        // 如果不在候选列，也可以考虑
                        if (gomokuBoard[block.x][block.y] === 0) {
                            return block;
                        }
                    }
                }
            }
            
            return null;
        }


        // ========== 优化AI决策函数 ==========
        function getGomokuAIMove() {
            const startTime = Date.now();
            const opponent = gomokuCurrentPlayer === 1 ? 2 : 1;
            
            // 开局处理
            if (gomokuMoveHistory.length === 0) {
                gomokuCurrentCandidates = [{ x: 7, y: 7, score: 1000 }];
                return { x: 7, y: 7 };
            }
            
            if (gomokuMoveHistory.length === 1 && gomokuBoard[7][7] !== 0) {
                // 角落应对更灵活
                const responses = [[6, 6], [6, 8], [8, 6], [8, 8]];
                const choice = responses[Math.floor(Math.random() * responses.length)];
                gomokuCurrentCandidates = [{ x: choice[0], y: choice[1], score: 1000 }];
                return { x: choice[0], y: choice[1] };
            }
            
            // 获取候选点
            const candidates = getGomokuCandidateMoves(true);
            let selectedMove = null;
            let selectionReason = '';
            
            // ========== 优先级1：直接获胜 ==========
            selectedMove = findWinningMove(candidates, gomokuCurrentPlayer);
            if (selectedMove) {
                selectionReason = '直接获胜';
            }
            
            // ========== 优先级2：阻止对方获胜 ==========
            if (!selectedMove) {
                selectedMove = findWinningMove(candidates, opponent);
                if (selectedMove) selectionReason = '阻止对方获胜';
            }
            
            // ========== 优先级3：VCF必胜搜索 ==========
            if (!selectedMove) {
                const vcfResult = vcfSearch(gomokuCurrentPlayer, VCF_MAX_DEPTH, true);
                if (vcfResult) {
                    selectedMove = { x: vcfResult.x, y: vcfResult.y, score: GOMOKU_SCORES.VCF_WIN };
                    selectionReason = 'VCF必胜';
                }
            }
            
            // ========== 优先级4：阻止对方VCF ==========
            if (!selectedMove) {
                const opponentVcf = vcfSearch(opponent, VCF_MAX_DEPTH, true);
                if (opponentVcf) {
                    selectedMove = findBestBlockMove(opponent, opponentVcf, candidates);
                    if (selectedMove) selectionReason = '阻断对方VCF';
                }
            }
            
            // 检测对方活三
            const opponentLiveThrees = findOpponentLiveThrees(opponent);
            const hasOpponentLiveThree = opponentLiveThrees.length > 0;
            
            // ========== 优先级5：VCT必胜（对方无活三时）==========
            if (!selectedMove && !hasOpponentLiveThree) {
                const vctResult = vctSearch(gomokuCurrentPlayer, VCT_MAX_DEPTH, true);
                if (vctResult) {
                    selectedMove = { x: vctResult.x, y: vctResult.y, score: GOMOKU_SCORES.VCT_WIN };
                    selectionReason = 'VCT必胜';
                }
            }
            
            // ========== 优先级6：防守对方活三 ==========
            if (!selectedMove && hasOpponentLiveThree) {
                selectedMove = findBestLiveThreeBlock(opponentLiveThrees, candidates, opponent);
                if (selectedMove) selectionReason = '防守活三';
            }
            
            // ========== 优先级7：必杀棋型（活四、双活三、冲四活三）==========
            if (!selectedMove) {
                selectedMove = findKillerMove(candidates, gomokuCurrentPlayer, hasOpponentLiveThree);
                if (selectedMove) selectionReason = selectedMove.reason || '必杀棋型';
            }
            
            // ========== 优先级8：防守对方必杀棋型 ==========
            if (!selectedMove) {
                selectedMove = findKillerMove(candidates, opponent, false);
                if (selectedMove) selectionReason = '防守对方' + (selectedMove.reason || '必杀');
            }
            
            // ========== 优先级9：进攻布局（活三、活二）==========
            if (!selectedMove && !hasOpponentLiveThree) {
                selectedMove = findAttackMove(candidates, gomokuCurrentPlayer);
                if (selectedMove) selectionReason = selectedMove.reason || '进攻布局';
            }
            
            // ========== 优先级10：迭代加深搜索 ==========
            if (!selectedMove) {
                const searchResult = iterativeDeepeningSearch(gomokuAiSearchDepth, gomokuAiThinkingLimit - (Date.now() - startTime));
                if (searchResult && searchResult.move) {
                    selectedMove = searchResult.move;
                    selectionReason = '深度搜索';
                }
            }
            
            // ========== 兜底：选择最高分候选 ==========
            if (!selectedMove && candidates.length > 0) {
                selectedMove = candidates[0];
                selectionReason = '最高分候选';
            }
            
            // 输出决策日志
            console.log(`AI决策: ${selectionReason} -> (${selectedMove?.x}, ${selectedMove?.y})`);
            
            // 更新候选点显示
            updateCandidateDisplay(selectedMove);
            
            return selectedMove || { x: 7, y: 7 };
        }
        
        // ========== 辅助函数：查找获胜着法 ==========
        function findWinningMove(candidates, player) {
            for (const move of candidates) {
                gomokuBoard[move.x][move.y] = player;
                const wins = checkGomokuWin(move.x, move.y, player);
                gomokuBoard[move.x][move.y] = 0;
                if (wins) return move;
            }
            return null;
        }
        
        // ========== 辅助函数：查找必杀着法 ==========
        function findKillerMove(candidates, player, skipFourThree = false) {
            let bestFourThree = null;
            
            for (const move of candidates) {
                gomokuBoard[move.x][move.y] = player;
                
                // 检查活四
                const fourMoves = getRushFourMoves(player);
                const hasLiveFour = fourMoves.some(f => f.isLiveFour);
                
                // 检查活三数量
                let liveThreeCount = 0;
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
                for (const [dx, dy] of directions) {
                    const pattern = analyzeDirectionPattern(move.x, move.y, dx, dy, player);
                    if (pattern.count === 3 && pattern.isLive) liveThreeCount++;
                }
                
                gomokuBoard[move.x][move.y] = 0;
                
                // 活四必杀
                if (hasLiveFour) {
                    return { ...move, reason: '活四' };
                }
                
                // 双活三必杀
                if (liveThreeCount >= 2) {
                    return { ...move, reason: '双活三' };
                }
                
                // 冲四活三
                if (fourMoves.length > 0 && liveThreeCount >= 1 && !skipFourThree && !bestFourThree) {
                    bestFourThree = { ...move, reason: '冲四活三' };
                }
            }
            
            return bestFourThree;
        }
        
        // ========== 辅助函数：查找进攻着法 ==========
        function findAttackMove(candidates, player) {
            let bestMove = null;
            let bestScore = 0;
            
            for (const move of candidates) {
                gomokuBoard[move.x][move.y] = player;
                
                let liveThreeCount = 0, liveTwoCount = 0;
                const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
                
                for (const [dx, dy] of directions) {
                    const pattern = analyzeDirectionPattern(move.x, move.y, dx, dy, player);
                    if (pattern.count === 3 && pattern.isLive) liveThreeCount++;
                    if (pattern.count === 2 && pattern.isLive) liveTwoCount++;
                }
                
                gomokuBoard[move.x][move.y] = 0;
                
                // 活三优先
                if (liveThreeCount >= 1) {
                    return { ...move, reason: '活三' };
                }
                
                // 多活二次选
                const score = liveTwoCount * 100 + move.score;
                if (liveTwoCount >= 1 && score > bestScore) {
                    bestScore = score;
                    bestMove = { ...move, reason: liveTwoCount >= 2 ? '双活二' : '活二' };
                }
            }
            
            return bestMove;
        }
        
        // ========== 辅助函数：更新候选点显示 ==========
        function updateCandidateDisplay(selectedMove) {
            if (!selectedMove) return;
            
            const moveInCandidates = gomokuCurrentCandidates.find(c => c.x === selectedMove.x && c.y === selectedMove.y);
            if (moveInCandidates) {
                const maxScore = Math.max(...gomokuCurrentCandidates.map(c => c.score));
                moveInCandidates.score = maxScore + 1;
            } else {
                const maxScore = gomokuCurrentCandidates.length > 0 ? Math.max(...gomokuCurrentCandidates.map(c => c.score)) : 1000;
                gomokuCurrentCandidates.unshift({ x: selectedMove.x, y: selectedMove.y, score: maxScore + 1 });
            }
        }

        function gomokuAITurn() {
            if (gomokuGameOver || gomokuIsAITurn) return;
            
            gomokuIsAITurn = true;
            
            // 先计算AI落子，保存结果
            const aiMove = getGomokuAIMove();
            
            // 显示候选点（使用计算时的候选点，确保一致性）
            if (gomokuShowCandidates && gomokuCurrentCandidates.length > 0) {
                // 确保AI选择的落子点在候选点列表中且标记为最优
                const aiMoveInCandidates = gomokuCurrentCandidates.find(c => c.x === aiMove.x && c.y === aiMove.y);
                if (aiMoveInCandidates) {
                    // 将AI选择的点设为最高分，确保显示为黄色
                    const maxScore = Math.max(...gomokuCurrentCandidates.map(c => c.score));
                    aiMoveInCandidates.score = maxScore + 1;
                }
                drawGomokuBoard();
            }
            
            // 延迟执行落子，让候选点显示更久
            const thinkingDelay = gomokuShowCandidates ? 800 : 100;
            
            gomokuAiThinkingTimeout = setTimeout(() => {
                // 清除候选点显示
                gomokuCurrentCandidates = [];
                
                if (aiMove) {
                    placeGomokuPiece(aiMove.x, aiMove.y, gomokuCurrentPlayer);
                }
                gomokuIsAITurn = false;
                
                if (!gomokuGameOver && gomokuCurrentPlayer !== gomokuPlayerRole) {
                    setTimeout(gomokuAITurn, 300);
                }
            }, thinkingDelay);
        }

        // 设置面板
        function openGomokuSettings() {
            document.getElementById('gomokuSettingsPanel').style.display = 'block';
            document.getElementById('gomokuSettingsOverlay').style.display = 'block';
            
            document.getElementById('gomokuThinkingTimeRange').value = gomokuAiThinkingLimit;
            document.getElementById('gomokuThinkingTimeValue').textContent = gomokuAiThinkingLimit;
            document.getElementById('gomokuSearchDepthRange').value = gomokuAiSearchDepth;
            document.getElementById('gomokuSearchDepthValue').textContent = gomokuAiSearchDepth;
            document.getElementById('gomokuCandidateCountRange').value = gomokuAiCandidateCount;
            document.getElementById('gomokuCandidateCountValue').textContent = gomokuAiCandidateCount;
            document.getElementById('gomokuShowCandidatesToggle').checked = gomokuShowCandidates;
        }
        
        function closeGomokuSettings() {
            document.getElementById('gomokuSettingsPanel').style.display = 'none';
            document.getElementById('gomokuSettingsOverlay').style.display = 'none';
        }
        
        function saveGomokuSettings() {
            gomokuAiThinkingLimit = parseInt(document.getElementById('gomokuThinkingTimeRange').value);
            gomokuAiSearchDepth = parseInt(document.getElementById('gomokuSearchDepthRange').value);
            gomokuAiCandidateCount = parseInt(document.getElementById('gomokuCandidateCountRange').value);
            gomokuShowCandidates = document.getElementById('gomokuShowCandidatesToggle').checked;
            
            document.getElementById('gomokuTimeLimit').textContent = gomokuAiThinkingLimit;
            document.getElementById('gomokuDepth').textContent = gomokuAiSearchDepth;
            document.getElementById('gomokuCandidates').textContent = gomokuAiCandidateCount;
            
            // 如果关闭候选点显示，清除当前显示的候选点
            if (!gomokuShowCandidates) {
                gomokuCurrentCandidates = [];
                drawGomokuBoard();
            }
            
            let level = '入门级';
            if (gomokuAiSearchDepth >= 6) level = '大师级';
            else if (gomokuAiSearchDepth >= 5) level = '专家级';
            else if (gomokuAiSearchDepth >= 4) level = '专业级';
            else if (gomokuAiSearchDepth >= 3) level = '进阶级';
            document.getElementById('gomokuAiLevel').textContent = level;
            
            closeGomokuSettings();
        }

        // 事件初始化
        function initGomokuEvents() {
            gomokuCanvas.onclick = (e) => {
                if (gomokuGameOver || gomokuIsAITurn || gomokuCurrentPlayer !== gomokuPlayerRole) return;
                
                const rect = gomokuCanvas.getBoundingClientRect();
                const scaleX = gomokuCanvas.width / rect.width;
                const scaleY = gomokuCanvas.height / rect.height;
                
                const x = Math.round(((e.clientX - rect.left) * scaleX - GOMOKU_BOARD_MARGIN) / GOMOKU_CELL_SIZE);
                const y = Math.round(((e.clientY - rect.top) * scaleY - GOMOKU_BOARD_MARGIN) / GOMOKU_CELL_SIZE);
                
                if (x >= 0 && x < GOMOKU_BOARD_SIZE && y >= 0 && y < GOMOKU_BOARD_SIZE) {
                    if (placeGomokuPiece(x, y, gomokuCurrentPlayer)) {
                        if (!gomokuGameOver && gomokuCurrentPlayer !== gomokuPlayerRole) {
                            setTimeout(gomokuAITurn, 300);
                        }
                    }
                }
            };

            document.getElementById('gomokuBlackBtn').onclick = function() {
                this.classList.add('selected');
                document.getElementById('gomokuWhiteBtn').classList.remove('selected');
                gomokuPlayerRole = 1;
                gomokuStatusElement.textContent = '已选择黑棋（先手）';
            };

            document.getElementById('gomokuWhiteBtn').onclick = function() {
                this.classList.add('selected');
                document.getElementById('gomokuBlackBtn').classList.remove('selected');
                gomokuPlayerRole = 2;
                gomokuStatusElement.textContent = '已选择白棋（后手）';
            };

            document.getElementById('gomokuStartBtn').onclick = () => {
                initGomokuBoard();
                gomokuCurrentPlayer = 1;
                if (gomokuPlayerRole === 2) {
                    setTimeout(gomokuAITurn, 300);
                }
            };

            document.getElementById('gomokuRestartBtn').onclick = () => {
                initGomokuBoard();
                gomokuCurrentPlayer = 1;
                if (gomokuPlayerRole === 2) {
                    setTimeout(gomokuAITurn, 300);
                }
            };

            document.getElementById('gomokuUndoBtn').onclick = () => {
                if (gomokuMoveHistory.length < 2 || gomokuGameOver || gomokuIsAITurn) return;
                
                clearTimeout(gomokuAiThinkingTimeout);
                stopCandidateAnimation();
                gomokuIsAITurn = false;
                
                // 悔棋：双方各撤回一步（共两步）
                let lastMove = gomokuMoveHistory.pop();
                gomokuBoard[lastMove.x][lastMove.y] = 0;
                
                if (gomokuMoveHistory.length > 0) {
                    lastMove = gomokuMoveHistory.pop();
                    gomokuBoard[lastMove.x][lastMove.y] = 0;
                }
                
                gomokuGameOver = false;
                gomokuCurrentPlayer = gomokuPlayerRole;
                drawGomokuBoard();
                updateGomokuStatus();
            };

            document.getElementById('gomokuSettingsBtn').onclick = openGomokuSettings;
            document.getElementById('gomokuCancelSettingsBtn').onclick = closeGomokuSettings;
            document.getElementById('gomokuSaveSettingsBtn').onclick = saveGomokuSettings;
            document.getElementById('gomokuSettingsOverlay').onclick = closeGomokuSettings;

            document.getElementById('gomokuThinkingTimeRange').oninput = function() {
                document.getElementById('gomokuThinkingTimeValue').textContent = this.value;
            };

            document.getElementById('gomokuSearchDepthRange').oninput = function() {
                document.getElementById('gomokuSearchDepthValue').textContent = this.value;
            };

            document.getElementById('gomokuCandidateCountRange').oninput = function() {
                document.getElementById('gomokuCandidateCountValue').textContent = this.value;
            };
        }

        // ==================== 星盘系统 ====================
        function astrolabe() {
            document.documentElement.style.overflow = 'hidden';
            document.getElementById('astrolabeModal').style.display = 'flex';
    
            // 初始化星盘系统
            initAstrolabe();
        }

        function closeAstrolabe() {
            document.getElementById('astrolabeModal').style.display = 'none';
            document.documentElement.style.overflow = '';
        }

        function initAstrolabe() {
            // 星盘可视化生成器
            const AstroVisualizer = {
                formatDatetime: (datetimeStr) => {
                    const dt = new Date(datetimeStr);
                    return `${dt.getFullYear()}年${dt.getMonth()+1}月${dt.getDate()}日 ${dt.getHours().toString().padStart(2,'0')}:${dt.getMinutes().toString().padStart(2,'0')}`;
                },

                formatDegree: (degObj) => {
                    if(!degObj) return '';
                    return `${degObj.deg}°${degObj.min}'${degObj.sec}"`;
                },

                generateHouses: (housesData) => {
                    return housesData.slice(0, 12).map(h => ({
                        name: h.house_life,
                        sign: h.sign.sign_chinese,
                        mainStar: h.main_planet[0]?.planet_chinese || '',
                        degree: AstroVisualizer.formatDegree(h.sign)
                    }));
                },

                createPlanetIndex: (planetsData) => {
                    const index = {};
                    planetsData.forEach(p => {
                        index[p.code_name] = {
                            name: p.planet_chinese,
                            sign: p.sign.sign_chinese,
                            degree: AstroVisualizer.formatDegree(p.sign),
                            house: p.house_id
                        }
                    });
                    return index;
                },

                generateHTML: (responseData) => {
                    const data = responseData.data;
                    const houses = AstroVisualizer.generateHouses(data.house);
                    const planets = AstroVisualizer.createPlanetIndex(data.planet);

                    return `
                    <div class="astrology-card">
                        <div class="astro-title">
                            <h2>星盘解析</h2>
                            <p>${AstroVisualizer.formatDatetime(data.user.birthday)}</p>
                            <p>坐标：东经${data.user.longitude}° 北纬${data.user.latitude}°</p>
                        </div>

                        <div class="planet-aspect">
                            <h3>核心配置</h3>
                            <div class="aspect-detail">
                                <p>太阳：${planets['0'].sign} ${planets['0'].degree}（第${planets['0'].house}宫）</p>
                                <p>月亮：${planets['1'].sign} ${planets['1'].degree}（第${planets['1'].house}宫）</p>
                                <p>上升：${planets['10'].sign} ${planets['10'].degree}</p>
                            </div>
                        </div>

                        <div class="house-section">
                            ${houses.map(h => `
                                <div class="house-item">
                                    <h4>${h.name}：${h.sign}</h4>
                                    ${h.mainStar ? `<p class="zodiac-sign">守护：${h.mainStar}</p>` : ''}
                                    <p class="zodiac-sign">${h.degree}</p>
                                </div>
                            `).join('')}
                        </div>

                        <div class="planet-aspect" style="margin-top:20px">
                            <h3>特殊相位</h3>
                            <div class="aspect-detail">
                                <p>太阳-月亮相位：${data.attribute.wind.length ? '风向特质显著' : '无显著相位'}</p>
                                ${planets['Regulus'] ? 
                                `<p>轩辕十四：${planets['Regulus'].sign} ${planets['Regulus'].degree}（古典吉星）</p>` : ''}
                            </div>
                        </div>
                    </div>`;
                }
            };

            // 确保jQuery已加载
            if(typeof jQuery === 'undefined') {
                console.error('jQuery未加载');
                return;
            }

            $('#submitBtn').off('click').on('click', function() {
                // 验证出生时间是否已填写
                const birthdayVal = $('#birthday').val();
                if (!birthdayVal) {
                    $('#result').html('<div style="color:#ff69b4">💕 请先选择出生时间</div>');
                    return;
                }

                const ajaxData = {
                    access_token: '989f888c4283e2cc2d8a5aa4af60932c',
                    birthday: birthdayVal.replace('T', ' ') + ':00',
                    longitude: $('#longitude').val(),
                    latitude: $('#latitude').val(),
                    tz: $('#tz').val(),
                    h_sys: $('#h_sys').val(),
                    planets: ['0','1','2','3','4'],
                    planet_xs: ['433'],
                    planet_xf: ['Regulus'],
                    virtual: ['10'],
                    svg_type: ['1'],
                    phase: {'0':0.5,'30':0.5},
                    is_corpus: ['1']
                };

                $('#result').html('<div class="loading">🐱 星体运行计算中...</div>');

                $.ajax({
                    type: "POST",
                    url: "http://www.xingpan.vip/astrology/chart/natal",
                    data: ajaxData,
                    timeout: 30000, // 30秒超时
                    success: function (result) {
                        if(result.code === 0) {
                            const vizHTML = AstroVisualizer.generateHTML(result);
                            $('#result').html(vizHTML);
                        } else {
                            $('#result').html(`<div style="color:#ff69b4">💕 API错误：${result.msg || '未知错误'}</div>`);
                        }
                    },
                    error: function (xhr, status, error) {
                        let errorMsg = '服务器连接失败';
                        if (status === 'timeout') {
                            errorMsg = '请求超时，请稍后重试';
                        } else if (xhr.status === 0) {
                            errorMsg = '网络连接失败或跨域被阻止';
                        } else if (xhr.status >= 500) {
                            errorMsg = '星盘服务器暂时不可用';
                        } else if (xhr.responseText) {
                            errorMsg = xhr.responseText;
                        }
                        $('#result').html(`<div style="color:#ff69b4">💕 ${errorMsg}</div>`);
                        console.error('星盘API请求失败:', status, error, xhr);
                    }
                });
            });
        }

        // ==================== 海德平衡理论系统 ====================
        // 全局变量
        let heiderNodes = [];
        let heiderLinks = [];
        let heiderSimulation;
        let heiderSvg, heiderG, heiderLink, heiderNodeGroup, heiderCliqueHighlight;
        let heiderIsEvolving = false;
        let heiderEvolutionInterval;
        let heiderEvolutionStep = 0;
        let heiderNodeRadius = 25;
        let heiderLinkDistance = 100;
        let heiderFontSize = 12;
        let heiderMinRadius = 15;
        let heiderMaxRadius = 30;
        let heiderBaseDistance = 100;
        let heiderMinFontSize = 10;
        let heiderMaxCliques = [];
        let heiderProfileEditorVisible = false;
        let heiderJitterInterval;
        let heiderSeparationInProgress = false;

        // 默认人物档案数据
        const heiderDefaultProfiles = {
            names: ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'],
            ages: [25, 30, 28, 35, 22, 40, 27, 33, 26, 29],
            genders: ['女', '男', '男', '男', '女', '男', '女', '男', '女', '男'],
            colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9E9E', '#5F6368', '#1A73E8']
        };

        // 打开海德平衡理论弹窗
        function openHeiderBalance() {
            const modal = document.getElementById('heiderModal');
            modal.style.display = 'flex';
            document.documentElement.style.overflow = 'hidden';
            
            // 延迟初始化以确保DOM已渲染
            setTimeout(() => {
                heiderInitializeSVG();
                heiderGenerateNetwork();
            }, 100);
        }

        // 关闭海德平衡理论弹窗
        function closeHeiderBalance() {
            const modal = document.getElementById('heiderModal');
            modal.style.display = 'none';
            document.documentElement.style.overflow = '';
            
            // 停止演化
            if (heiderIsEvolving) {
                heiderStopEvolution();
            }
        }

        // 初始化SVG
        function heiderInitializeSVG() {
            const container = document.querySelector('.heider-visualization');
            if (!container) return;
            
            const width = container.clientWidth;
            const height = container.clientHeight;

            // 清除旧的SVG内容
            d3.select('#heider-network-svg').selectAll('*').remove();

            heiderSvg = d3.select('#heider-network-svg')
                .attr('width', width)
                .attr('height', height);

            heiderG = heiderSvg.append('g');

            // 添加缩放功能
            const zoom = d3.zoom()
                .scaleExtent([0.1, 4])
                .on('zoom', (event) => {
                    heiderG.attr('transform', event.transform);
                });

            heiderSvg.call(zoom);
        }

        // 计算动态参数
        function heiderCalculateDynamicParameters(nodeCount) {
            heiderNodeRadius = Math.max(heiderMinRadius, Math.min(heiderMaxRadius, heiderMaxRadius * 4 / Math.sqrt(nodeCount)));
            heiderLinkDistance = heiderBaseDistance * Math.max(1, nodeCount / 5);
            heiderFontSize = Math.max(heiderMinFontSize, heiderNodeRadius * 0.6);
        }

        // 生成网络
        function heiderGenerateNetwork() {
            const nodeCount = parseInt(document.getElementById('heiderNodeCount').value) || 4;
            heiderCalculateDynamicParameters(nodeCount);
            
            // 生成节点
            heiderNodes = [];
            for (let i = 0; i < nodeCount; i++) {
                heiderNodes.push({
                    id: i,
                    name: i < heiderDefaultProfiles.names.length ? heiderDefaultProfiles.names[i] : String.fromCharCode(65 + i),
                    displayName: String.fromCharCode(65 + i),
                    customDisplayName: '',
                    age: i < heiderDefaultProfiles.ages.length ? heiderDefaultProfiles.ages[i] : 25 + Math.floor(Math.random() * 15),
                    gender: i < heiderDefaultProfiles.genders.length ? heiderDefaultProfiles.genders[i] : (Math.random() > 0.5 ? '男' : '女'),
                    group: Math.floor(Math.random() * 3),
                    avatar: null,
                    displayMode: 'letter',
                    customColor: i < heiderDefaultProfiles.colors.length ? heiderDefaultProfiles.colors[i] : '#4285F4'
                });
            }

            // 生成边（完全图）
            heiderLinks = [];
            for (let i = 0; i < nodeCount; i++) {
                for (let j = i + 1; j < nodeCount; j++) {
                    heiderLinks.push({
                        source: i,
                        target: j,
                        value: Math.random() > 0.5 ? 1 : -1
                    });
                }
            }

            heiderUpdateVisualization();
            heiderUpdateStats();
            heiderUpdateProfileEditors();
            heiderApplyInitialZoom(nodeCount);
        }

        // 根据节点数量应用初始缩放
        function heiderApplyInitialZoom(nodeCount) {
            if (nodeCount > 15) {
                heiderSvg.call(d3.zoom().transform, d3.zoomIdentity.scale(0.8));
            } else if (nodeCount > 10) {
                heiderSvg.call(d3.zoom().transform, d3.zoomIdentity.scale(0.9));
            } else {
                heiderResetView();
            }
        }

        // 更新节点数量
        function heiderUpdateNodeCount() {
            const newNodeCount = parseInt(document.getElementById('heiderNodeCount').value);
            if (newNodeCount === heiderNodes.length) return;
            heiderGenerateNetwork();
        }

        // 更新可视化
        function heiderUpdateVisualization() {
            if (!heiderSvg) return;
            
            const container = document.querySelector('.heider-visualization');
            const width = container.clientWidth;
            const height = container.clientHeight;

            // 清除现有元素
            heiderG.selectAll('*').remove();
            
            // 添加小团体高亮组
            heiderCliqueHighlight = heiderG.append('g').attr('class', 'heider-clique-highlights');

            // 创建力导向模型
            heiderSimulation = d3.forceSimulation(heiderNodes)
                .force('link', d3.forceLink(heiderLinks).id(d => d.id).distance(heiderLinkDistance))
                .force('charge', d3.forceManyBody().strength(-300))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collision', d3.forceCollide().radius(heiderNodeRadius + 5));

            // 绘制边
            heiderLink = heiderG.append('g')
                .selectAll('line')
                .data(heiderLinks)
                .join('line')
                .attr('class', d => `heider-link ${d.value > 0 ? 'heider-link-pos' : 'heider-link-neg'}`)
                .on('click', heiderToggleLink)
                .on('mouseover', heiderShowLinkTooltip)
                .on('mouseout', heiderHideTooltip);

            // 绘制节点组
            heiderNodeGroup = heiderG.append('g')
                .selectAll('g')
                .data(heiderNodes)
                .join('g')
                .attr('class', 'heider-node-group')
                .call(heiderDrag(heiderSimulation))
                .on('mouseover', heiderShowNodeTooltip)
                .on('mouseout', heiderHideTooltip);

            // 节点圆圈
            heiderNodeGroup.append('circle')
                .attr('class', 'heider-node')
                .attr('r', heiderNodeRadius)
                .attr('fill', d => d.customColor || d3.schemeCategory10[d.group]);

            // 更新显示内容
            heiderUpdateNodeDisplayContent();

            // 应用节点可见性设置
            const showNodes = document.getElementById('heiderShowNodes').checked;
            heiderNodeGroup.style('opacity', showNodes ? 1 : 0);

            // 更新位置 - tick事件处理
            heiderSimulation.on('tick', heiderTickHandler);
        }
        
        // tick事件处理函数
        function heiderTickHandler() {
            if (!heiderLink || !heiderNodeGroup) return;
            
            // 更新所有边的位置
            heiderLink
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            // 更新所有节点的位置
            heiderNodeGroup
                .attr('transform', d => `translate(${d.x},${d.y})`);
            
            // 更新小团体高亮
            heiderUpdateCliqueHighlight();
        }

        // 更新节点显示内容
        function heiderUpdateNodeDisplayContent() {
            heiderNodeGroup.selectAll('text, image').remove();
            
            heiderNodeGroup.each(function(d) {
                const group = d3.select(this);
                
                if (d.displayMode === 'avatar' && d.avatar) {
                    group.append('image')
                        .attr('href', d.avatar)
                        .attr('x', -heiderNodeRadius)
                        .attr('y', -heiderNodeRadius)
                        .attr('width', heiderNodeRadius * 2)
                        .attr('height', heiderNodeRadius * 2)
                        .style('clip-path', 'circle(50%)');
                } else {
                    group.append('text')
                        .attr('class', 'heider-node-label')
                        .attr('font-size', heiderFontSize + 'px')
                        .text(heiderGetNodeDisplayContent(d));
                }
            });
        }

        // 获取节点显示内容
        function heiderGetNodeDisplayContent(node) {
            switch (node.displayMode) {
                case 'custom': return node.customDisplayName || node.displayName;
                case 'avatar': return node.avatar ? '' : node.displayName;
                default: return node.displayName;
            }
        }

        // 切换节点显示/隐藏
        function heiderToggleNodeVisibility() {
            const showNodes = document.getElementById('heiderShowNodes').checked;
            if (heiderNodeGroup) {
                heiderNodeGroup.style('opacity', showNodes ? 1 : 0);
            }
        }

        // 更新小团体高亮
        function heiderUpdateCliqueHighlight() {
            if (!heiderCliqueHighlight) return;
            heiderCliqueHighlight.selectAll('*').remove();
            
            heiderMaxCliques.forEach((clique, index) => {
                if (clique.length >= 3) {
                    const points = clique.map(nodeId => {
                        const node = heiderNodes[nodeId];
                        return [node.x, node.y];
                    });
                    
                    const hull = d3.polygonHull(points);
                    if (hull) {
                        heiderCliqueHighlight.append('path')
                            .attr('d', `M${hull.join('L')}Z`)
                            .attr('class', 'heider-clique-highlight')
                            .style('fill', d3.schemeCategory10[index % 10])
                            .style('fill-opacity', 0.1);
                    }
                }
            });
        }

        // 拖动功能 - 0延迟实时跟随（使用原生D3方式）
        function heiderDrag(simulation) {
            function dragstarted(event, d) {
                // 添加拖动样式
                d3.select(this).classed('dragging', true);
                
                // 激活simulation
                if (!event.active) simulation.alphaTarget(0.3).restart();
                
                // 固定节点到当前位置
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                // 直接更新固定位置到鼠标位置
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                // 移除拖动样式
                d3.select(this).classed('dragging', false);
                
                // 停止simulation
                if (!event.active) simulation.alphaTarget(0);
                
                // 释放固定，让节点可以自由移动
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        // 切换边的关系
        function heiderToggleLink(event, d) {
            if (heiderIsEvolving) return;
            
            d.value *= -1;
            d3.select(event.target)
                .attr('class', `heider-link ${d.value > 0 ? 'heider-link-pos' : 'heider-link-neg'}`);
            
            heiderUpdateStats();
        }

        // 显示节点提示
        function heiderShowNodeTooltip(event, d) {
            const tooltip = document.getElementById('heiderTooltip');
            tooltip.innerHTML = `
                <strong>${d.displayName} (${d.name})</strong><br>
                年龄: ${d.age}<br>
                性别: ${d.gender}<br>
                颜色: ${d.customColor}
            `;
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = event.pageY - 30 + 'px';
            tooltip.style.opacity = 1;
        }

        // 显示边提示
        function heiderShowLinkTooltip(event, d) {
            const tooltip = document.getElementById('heiderTooltip');
            const sourceName = heiderNodes[d.source.id !== undefined ? d.source.id : d.source].displayName;
            const targetName = heiderNodes[d.target.id !== undefined ? d.target.id : d.target].displayName;
            const relation = d.value > 0 ? '好' : '不好';
            tooltip.innerHTML = `${sourceName} - ${targetName}: 关系${relation}<br><small>点击切换关系</small>`;
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = event.pageY - 30 + 'px';
            tooltip.style.opacity = 1;
        }

        // 隐藏提示
        function heiderHideTooltip() {
            document.getElementById('heiderTooltip').style.opacity = 0;
        }

        // 随机化关系
        function heiderRandomizeRelations() {
            heiderLinks.forEach(link => {
                link.value = Math.random() > 0.5 ? 1 : -1;
            });
            // 只更新边的样式，不重建整个可视化
            if (heiderLink) {
                heiderLink.attr('class', d => `heider-link ${d.value > 0 ? 'heider-link-pos' : 'heider-link-neg'}`);
            }
            heiderUpdateStats();
        }

        // 切换人物档案编辑器
        function heiderToggleProfileEditor() {
            heiderProfileEditorVisible = !heiderProfileEditorVisible;
            const container = document.getElementById('heiderProfileContainer');
            const arrow = document.getElementById('heiderProfileArrow');
            
            if (heiderProfileEditorVisible) {
                container.classList.remove('heider-hidden');
                arrow.classList.add('expanded');
            } else {
                container.classList.add('heider-hidden');
                arrow.classList.remove('expanded');
            }
        }

        // 更新人物档案编辑器
        function heiderUpdateProfileEditors() {
            const container = document.getElementById('heiderProfileContainer');
            container.innerHTML = '';
            
            heiderNodes.forEach((node, index) => {
                const profileDiv = document.createElement('div');
                profileDiv.className = 'heider-profile-editor';
                profileDiv.innerHTML = `
                    <div class="heider-profile-header">节点 ${node.displayName}</div>
                    <div class="heider-profile-field">
                        <label>姓名:</label>
                        <input type="text" value="${node.name}" onchange="heiderUpdateNodeProfile(${index}, 'name', this.value)">
                    </div>
                    <div class="heider-profile-field">
                        <label>显示名:</label>
                        <input type="text" value="${node.customDisplayName}" onchange="heiderUpdateNodeProfile(${index}, 'customDisplayName', this.value)" placeholder="自定义名">
                    </div>
                    <div class="heider-profile-field">
                        <label>年龄:</label>
                        <input type="number" value="${node.age}" min="1" max="100" onchange="heiderUpdateNodeProfile(${index}, 'age', parseInt(this.value))">
                    </div>
                    <div class="heider-profile-field">
                        <label>性别:</label>
                        <select onchange="heiderUpdateNodeProfile(${index}, 'gender', this.value)">
                            <option value="男" ${node.gender === '男' ? 'selected' : ''}>男</option>
                            <option value="女" ${node.gender === '女' ? 'selected' : ''}>女</option>
                        </select>
                    </div>
                    <div class="heider-profile-field">
                        <label>颜色:</label>
                        <input type="color" value="${node.customColor}" onchange="heiderUpdateNodeProfile(${index}, 'customColor', this.value)">
                        <div class="heider-color-preview" style="background-color: ${node.customColor}"></div>
                    </div>
                    <div class="heider-profile-field">
                        <label>头像:</label>
                        <input type="file" accept="image/*" onchange="heiderHandleAvatarUpload(${index}, event)">
                        ${node.avatar ? `<img class="heider-avatar-preview" src="${node.avatar}">` : ''}
                    </div>
                    <div class="heider-profile-field">
                        <label>显示:</label>
                        <select onchange="heiderUpdateNodeProfile(${index}, 'displayMode', this.value)">
                            <option value="letter" ${node.displayMode === 'letter' ? 'selected' : ''}>默认字母</option>
                            <option value="custom" ${node.displayMode === 'custom' ? 'selected' : ''}>自定义名称</option>
                            <option value="avatar" ${node.displayMode === 'avatar' ? 'selected' : ''}>头像图片</option>
                        </select>
                    </div>
                `;
                container.appendChild(profileDiv);
            });
        }

        // 更新节点档案
        function heiderUpdateNodeProfile(nodeIndex, field, value) {
            if (heiderNodes[nodeIndex]) {
                heiderNodes[nodeIndex][field] = value;
                
                if (field === 'customColor' && heiderNodeGroup) {
                    heiderNodeGroup.filter(d => d.id === nodeIndex)
                        .select('.heider-node')
                        .attr('fill', value);
                }
                
                if (field === 'displayMode' || field === 'customDisplayName') {
                    heiderUpdateNodeDisplayContent();
                }
            }
        }

        // 图片剪裁相关变量
        let heiderCropImage = null;
        let heiderCropNodeIndex = -1;
        let heiderCropBox = { x: 50, y: 50, size: 100 };
        let heiderCropDragging = false;
        let heiderCropResizing = false;
        let heiderCropResizeHandle = '';
        let heiderCropStartX = 0;
        let heiderCropStartY = 0;

        // 处理头像上传 - 打开剪裁界面
        function heiderHandleAvatarUpload(nodeIndex, event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                heiderCropNodeIndex = nodeIndex;
                const reader = new FileReader();
                reader.onload = function(e) {
                    heiderOpenCropModal(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }

        // 打开剪裁模态框
        function heiderOpenCropModal(imageSrc) {
            const modal = document.getElementById('heiderCropModal');
            modal.style.display = 'flex';
            
            heiderCropImage = new Image();
            heiderCropImage.onload = function() {
                const canvas = document.getElementById('heiderCropCanvas');
                const ctx = canvas.getContext('2d');
                
                // 计算画布尺寸，保持图片比例
                const maxWidth = 400;
                const maxHeight = 400;
                let width = heiderCropImage.width;
                let height = heiderCropImage.height;
                
                if (width > maxWidth) {
                    height = height * maxWidth / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = width * maxHeight / height;
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(heiderCropImage, 0, 0, width, height);
                
                // 初始化剪裁框（正方形，居中）
                const minDim = Math.min(width, height);
                heiderCropBox = {
                    x: (width - minDim * 0.6) / 2,
                    y: (height - minDim * 0.6) / 2,
                    size: minDim * 0.6
                };
                
                heiderUpdateCropBox();
                heiderUpdateCropPreview();
                heiderInitCropEvents();
            };
            heiderCropImage.src = imageSrc;
        }

        // 关闭剪裁模态框
        function heiderCloseCropModal() {
            document.getElementById('heiderCropModal').style.display = 'none';
            heiderCropImage = null;
            heiderCropNodeIndex = -1;
        }

        // 更新剪裁框位置
        function heiderUpdateCropBox() {
            const cropBox = document.getElementById('heiderCropBox');
            cropBox.style.left = heiderCropBox.x + 'px';
            cropBox.style.top = heiderCropBox.y + 'px';
            cropBox.style.width = heiderCropBox.size + 'px';
            cropBox.style.height = heiderCropBox.size + 'px';
        }

        // 更新预览
        function heiderUpdateCropPreview() {
            const canvas = document.getElementById('heiderCropCanvas');
            const previewCanvas = document.getElementById('heiderPreviewCanvas');
            const previewCtx = previewCanvas.getContext('2d');
            
            previewCanvas.width = 100;
            previewCanvas.height = 100;
            
            // 计算原图上的剪裁区域
            const scaleX = heiderCropImage.width / canvas.width;
            const scaleY = heiderCropImage.height / canvas.height;
            
            const sx = heiderCropBox.x * scaleX;
            const sy = heiderCropBox.y * scaleY;
            const sSize = heiderCropBox.size * scaleX;
            
            previewCtx.drawImage(heiderCropImage, sx, sy, sSize, sSize, 0, 0, 100, 100);
        }

        // 初始化剪裁事件
        function heiderInitCropEvents() {
            const cropBox = document.getElementById('heiderCropBox');
            const container = document.querySelector('.heider-crop-container');
            
            // 移除旧事件
            cropBox.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            
            // 剪裁框拖动
            cropBox.onmousedown = function(e) {
                if (e.target.classList.contains('heider-crop-handle')) {
                    heiderCropResizing = true;
                    heiderCropResizeHandle = e.target.className.split(' ')[1];
                } else {
                    heiderCropDragging = true;
                }
                heiderCropStartX = e.clientX;
                heiderCropStartY = e.clientY;
                e.preventDefault();
            };
            
            document.onmousemove = function(e) {
                if (!heiderCropDragging && !heiderCropResizing) return;
                
                const canvas = document.getElementById('heiderCropCanvas');
                const dx = e.clientX - heiderCropStartX;
                const dy = e.clientY - heiderCropStartY;
                
                if (heiderCropDragging) {
                    heiderCropBox.x = Math.max(0, Math.min(canvas.width - heiderCropBox.size, heiderCropBox.x + dx));
                    heiderCropBox.y = Math.max(0, Math.min(canvas.height - heiderCropBox.size, heiderCropBox.y + dy));
                } else if (heiderCropResizing) {
                    const minSize = 30;
                    let newSize = heiderCropBox.size;
                    
                    if (heiderCropResizeHandle.includes('se')) {
                        newSize = Math.max(minSize, heiderCropBox.size + Math.max(dx, dy));
                    } else if (heiderCropResizeHandle.includes('nw')) {
                        const delta = Math.min(dx, dy);
                        newSize = Math.max(minSize, heiderCropBox.size - delta);
                        if (newSize !== heiderCropBox.size) {
                            heiderCropBox.x += heiderCropBox.size - newSize;
                            heiderCropBox.y += heiderCropBox.size - newSize;
                        }
                    } else if (heiderCropResizeHandle.includes('ne')) {
                        newSize = Math.max(minSize, heiderCropBox.size + Math.max(dx, -dy));
                        if (newSize !== heiderCropBox.size && dy < 0) {
                            heiderCropBox.y += heiderCropBox.size - newSize;
                        }
                    } else if (heiderCropResizeHandle.includes('sw')) {
                        newSize = Math.max(minSize, heiderCropBox.size + Math.max(-dx, dy));
                        if (newSize !== heiderCropBox.size && dx < 0) {
                            heiderCropBox.x += heiderCropBox.size - newSize;
                        }
                    }
                    
                    // 边界检查
                    newSize = Math.min(newSize, canvas.width - heiderCropBox.x, canvas.height - heiderCropBox.y);
                    heiderCropBox.size = newSize;
                }
                
                heiderCropStartX = e.clientX;
                heiderCropStartY = e.clientY;
                heiderUpdateCropBox();
                heiderUpdateCropPreview();
            };
            
            document.onmouseup = function() {
                heiderCropDragging = false;
                heiderCropResizing = false;
            };
        }

        // 应用剪裁
        function heiderApplyCrop() {
            const canvas = document.getElementById('heiderCropCanvas');
            const outputCanvas = document.createElement('canvas');
            const outputCtx = outputCanvas.getContext('2d');
            
            // 输出尺寸
            const outputSize = 200;
            outputCanvas.width = outputSize;
            outputCanvas.height = outputSize;
            
            // 计算原图上的剪裁区域
            const scaleX = heiderCropImage.width / canvas.width;
            const scaleY = heiderCropImage.height / canvas.height;
            
            const sx = heiderCropBox.x * scaleX;
            const sy = heiderCropBox.y * scaleY;
            const sSize = heiderCropBox.size * scaleX;
            
            outputCtx.drawImage(heiderCropImage, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);
            
            // 保存剪裁后的图片
            const croppedImage = outputCanvas.toDataURL('image/png');
            heiderNodes[heiderCropNodeIndex].avatar = croppedImage;
            
            heiderUpdateNodeDisplayContent();
            heiderUpdateProfileEditors();
            heiderCloseCropModal();
        }

        // 查找边
        function heiderFindLink(sourceId, targetId) {
            return heiderLinks.find(l => 
                (l.source.id === sourceId && l.target.id === targetId) ||
                (l.source.id === targetId && l.target.id === sourceId) ||
                (l.source === sourceId && l.target === targetId) ||
                (l.source === targetId && l.target === sourceId)
            );
        }

        // 检查两个节点是否有正连接
        function heiderIsConnectedPositively(nodeId1, nodeId2) {
            if (nodeId1 === nodeId2) return true;
            const edge = heiderFindLink(nodeId1, nodeId2);
            return edge && edge.value > 0;
        }

        // 查找最大小团体
        function heiderFindMaxCliques() {
            if (heiderNodes.length < 2) return [];

            const unvisited = new Set(heiderNodes.map(n => n.id));
            const components = [];

            while (unvisited.size > 0) {
                const startNodeId = unvisited.values().next().value;
                const currentComponent = new Set();
                const queue = [startNodeId];
                
                unvisited.delete(startNodeId);
                currentComponent.add(startNodeId);

                while (queue.length > 0) {
                    const currentNodeId = queue.shift();
                    
                    for (const link of heiderLinks) {
                        if (link.value > 0) {
                            let neighborId = -1;
                            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                            const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                            if (sourceId === currentNodeId && unvisited.has(targetId)) {
                                neighborId = targetId;
                            } else if (targetId === currentNodeId && unvisited.has(sourceId)) {
                                neighborId = sourceId;
                            }

                            if (neighborId !== -1) {
                                unvisited.delete(neighborId);
                                currentComponent.add(neighborId);
                                queue.push(neighborId);
                            }
                        }
                    }
                }
                components.push(Array.from(currentComponent));
            }

            const validCliques = [];
            for (const component of components) {
                if (component.length < 2) continue;

                let isAValidClique = true;
                for (let i = 0; i < component.length; i++) {
                    for (let j = i + 1; j < component.length; j++) {
                        if (!heiderIsConnectedPositively(component[i], component[j])) {
                            isAValidClique = false;
                            break;
                        }
                    }
                    if (!isAValidClique) break;
                }

                if (isAValidClique) {
                    validCliques.push(component);
                }
            }

            return validCliques;
        }

        // 更新统计信息
        function heiderUpdateStats() {
            const nodeCount = heiderNodes.length;
            const linkCount = heiderLinks.length;
            
            let balancedTriplets = 0;
            let unbalancedTripletsCount = 0;
            let perfectTriplets = 0;
            
            const totalTriplets = (nodeCount * (nodeCount - 1) * (nodeCount - 2)) / 6;

            if (totalTriplets > 0) {
                for (let i = 0; i < nodeCount; i++) {
                    for (let j = i + 1; j < nodeCount; j++) {
                        for (let k = j + 1; k < nodeCount; k++) {
                            const edge1 = heiderFindLink(i, j);
                            const edge2 = heiderFindLink(j, k);
                            const edge3 = heiderFindLink(i, k);
                            
                            if (edge1 && edge2 && edge3) {
                                const product = edge1.value * edge2.value * edge3.value;
                                if (product > 0) {
                                    balancedTriplets++;
                                    if (edge1.value > 0 && edge2.value > 0 && edge3.value > 0) {
                                        perfectTriplets++;
                                    }
                                }
                            }
                        }
                    }
                }
                unbalancedTripletsCount = totalTriplets - balancedTriplets;
            }

            heiderMaxCliques = heiderFindMaxCliques();
            
            document.getElementById('heiderNodeCountStat').textContent = nodeCount;
            document.getElementById('heiderLinkCountStat').textContent = linkCount;
            document.getElementById('heiderBalancedTripletsStat').textContent = Math.round(balancedTriplets);
            document.getElementById('heiderUnbalancedTripletsStat').textContent = Math.round(unbalancedTripletsCount);
            document.getElementById('heiderCliqueCountStat').textContent = perfectTriplets;
            document.getElementById('heiderMaxCliqueCountStat').textContent = heiderMaxCliques.length;
            
            const isBalanced = unbalancedTripletsCount === 0;
            const statusIndicator = document.getElementById('heiderStatusIndicator');
            const networkStatus = document.getElementById('heiderNetworkStatus');
            
            if (isBalanced) {
                statusIndicator.classList.add('balanced');
                networkStatus.textContent = '平衡';
            } else {
                statusIndicator.classList.remove('balanced');
                networkStatus.textContent = '不平衡';
            }
            
            const balancePercentage = totalTriplets > 0 ? (balancedTriplets / totalTriplets) * 100 : 100;
            document.getElementById('heiderBalanceProgress').style.width = balancePercentage + '%';
            
            heiderUpdateCliqueHighlight();
        }

        // 切换演化状态
        function heiderToggleEvolution() {
            if (heiderIsEvolving) {
                heiderStopEvolution();
            } else {
                heiderStartEvolution();
            }
        }

        // 开始演化
        function heiderStartEvolution() {
            heiderIsEvolving = true;
            heiderEvolutionStep = 0;
            const btn = document.getElementById('heiderEvolveBtn');
            btn.textContent = '停止演化';
            btn.classList.remove('heider-btn-primary');
            btn.classList.add('heider-btn-danger');
            
            heiderStartNodeJitter();
            
            const speed = parseInt(document.getElementById('heiderEvolutionSpeed').value);
            heiderEvolutionInterval = setInterval(heiderEvolveStep, speed);
        }

        // 停止演化
        function heiderStopEvolution() {
            heiderIsEvolving = false;
            clearInterval(heiderEvolutionInterval);
            heiderStopNodeJitter();
            
            const btn = document.getElementById('heiderEvolveBtn');
            btn.textContent = '开始演化';
            btn.classList.remove('heider-btn-danger');
            btn.classList.add('heider-btn-primary');
        }

        // 开始节点抖动动画
        function heiderStartNodeJitter() {
            if (heiderJitterInterval) clearInterval(heiderJitterInterval);
            
            heiderJitterInterval = setInterval(() => {
                if (!heiderNodeGroup || !heiderIsEvolving) return;
                
                heiderNodeGroup.each(function(d) {
                    d.x += (Math.random() - 0.5) * 4;
                    d.y += (Math.random() - 0.5) * 4;
                });
                
                if (heiderSimulation) {
                    heiderSimulation.alpha(0.1).restart();
                }
            }, 200);
        }

        // 停止节点抖动动画
        function heiderStopNodeJitter() {
            if (heiderJitterInterval) {
                clearInterval(heiderJitterInterval);
                heiderJitterInterval = null;
            }
        }

        // 查找不平衡的三元组
        function heiderFindUnbalancedTriplets() {
            const triplets = [];
            
            for (let i = 0; i < heiderNodes.length; i++) {
                for (let j = i + 1; j < heiderNodes.length; j++) {
                    for (let k = j + 1; k < heiderNodes.length; k++) {
                        const edge1 = heiderFindLink(i, j);
                        const edge2 = heiderFindLink(j, k);
                        const edge3 = heiderFindLink(i, k);
                        
                        if (edge1 && edge2 && edge3) {
                            const product = edge1.value * edge2.value * edge3.value;
                            if (product < 0) {
                                triplets.push([i, j, k]);
                            }
                        }
                    }
                }
            }
            
            return triplets;
        }

        // 演化步骤 - 基于关系压力的优化算法
        function heiderEvolveStep() {
            heiderEvolutionStep++;

            const unbalancedTriplets = heiderFindUnbalancedTriplets();

            if (unbalancedTriplets.length === 0) {
                heiderStopEvolution();
                setTimeout(() => {
                    heiderSeparateCliques();
                }, 500);
                heiderShowBalancedMessage();
                return;
            }

            // 计算每条边的"关系压力"
            const stressMap = new Map();
            heiderLinks.forEach(link => stressMap.set(link, 0));

            unbalancedTriplets.forEach(triplet => {
                const [i, j, k] = triplet;
                const edge1 = heiderFindLink(i, j);
                const edge2 = heiderFindLink(j, k);
                const edge3 = heiderFindLink(i, k);

                if (edge1) stressMap.set(edge1, stressMap.get(edge1) + 1);
                if (edge2) stressMap.set(edge2, stressMap.get(edge2) + 1);
                if (edge3) stressMap.set(edge3, stressMap.get(edge3) + 1);
            });

            // 找到压力最大的边
            let maxStress = -1;
            let linkToFlip = null;

            for (const [link, stress] of stressMap.entries()) {
                if (stress > maxStress) {
                    maxStress = stress;
                    linkToFlip = link;
                }
            }
            
            // 翻转压力最大的边
            if (linkToFlip) {
                linkToFlip.value *= -1;
                heiderLink.attr('class', d => `heider-link ${d.value > 0 ? 'heider-link-pos' : 'heider-link-neg'}`);
                heiderUpdateStats();
            } else {
                heiderStopEvolution();
            }
        }

        // 小团体分离动画
        function heiderSeparateCliques() {
            if (!document.getElementById('heiderEnableSeparation').checked || heiderSeparationInProgress) return;
            
            heiderSeparationInProgress = true;
            const width = heiderSvg.node().clientWidth;
            const height = heiderSvg.node().clientHeight;
            
            const cliquePositions = [];
            
            heiderMaxCliques.forEach((clique, index) => {
                if (clique.length >= 2) {
                    const angle = (index * 2 * Math.PI) / heiderMaxCliques.length;
                    const radius = Math.min(width, height) * 0.3;
                    cliquePositions.push({
                        clique: clique,
                        centerX: width / 2 + Math.cos(angle) * radius,
                        centerY: height / 2 + Math.sin(angle) * radius
                    });
                }
            });
            
            const unassignedNodes = heiderNodes.filter(node => 
                !heiderMaxCliques.some(clique => clique.includes(node.id))
            );
            
            unassignedNodes.forEach((node, index) => {
                const angle = ((heiderMaxCliques.length + index) * 2 * Math.PI) / (heiderMaxCliques.length + unassignedNodes.length);
                const radius = Math.min(width, height) * 0.4;
                cliquePositions.push({
                    clique: [node.id],
                    centerX: width / 2 + Math.cos(angle) * radius,
                    centerY: height / 2 + Math.sin(angle) * radius
                });
            });
            
            cliquePositions.forEach((group, groupIndex) => {
                group.clique.forEach((nodeId, nodeIndex) => {
                    const node = heiderNodes[nodeId];
                    if (!node) return;
                    
                    const localAngle = (nodeIndex * 2 * Math.PI) / group.clique.length;
                    const localRadius = Math.min(30, group.clique.length * 8);
                    
                    node.targetX = group.centerX + Math.cos(localAngle) * localRadius;
                    node.targetY = group.centerY + Math.sin(localAngle) * localRadius;
                    node.group = groupIndex;
                });
            });
            
            heiderNodeGroup.transition()
                .duration(2000)
                .ease(d3.easeCubicInOut)
                .attr('transform', d => {
                    d.fx = d.targetX;
                    d.fy = d.targetY;
                    return `translate(${d.targetX},${d.targetY})`;
                })
                .on('end', () => {
                    heiderNodes.forEach(node => {
                        node.fx = null;
                        node.fy = null;
                        node.x = node.targetX;
                        node.y = node.targetY;
                    });
                    
                    heiderNodeGroup.select('.heider-node')
                        .transition()
                        .duration(500)
                        .attr('fill', d => d.customColor || d3.schemeCategory10[d.group]);
                    
                    heiderSeparationInProgress = false;
                    
                    if (heiderSimulation) {
                        heiderSimulation.alpha(0.3).restart();
                    }
                });
        }

        // 显示平衡完成消息
        function heiderShowBalancedMessage() {
            const tooltip = document.getElementById('heiderTooltip');
            tooltip.innerHTML = `网络已达到平衡状态！<br>演化步数: ${heiderEvolutionStep}<br>小团体正在自动分离...`;
            tooltip.style.left = '50%';
            tooltip.style.top = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            tooltip.style.opacity = 1;
            
            setTimeout(() => {
                tooltip.style.opacity = 0;
                tooltip.style.transform = 'none';
            }, 3000);
        }

        // 重置视图
        function heiderResetView() {
            if (heiderSvg) {
                heiderSvg.transition()
                    .duration(750)
                    .call(d3.zoom().transform, d3.zoomIdentity);
            }
        }

        // 显示理论描述
        function heiderShowTheoryDescription(type) {
            const desc = document.getElementById('heiderTheoryDescription');
            let title = '';
            let content = '';
    
            switch(type) {
                case 1:
                    title = '第一种情况：全好关系';
                    content = 'ABC三个关系都很好。这是平衡状态，因为所有关系都是积极的，没有冲突。';
                    break;
                case 2:
                    title = '第二种情况：两坏一好';
                    content = 'A和B关系好，但B和C关系不好，C和A关系也不好。这是平衡状态，因为B和C都反对对方，而A与B一致。';
                    break;
                case 5:
                    title = '第五种情况：两好一坏';
                    content = 'A和B关系好，B和C关系好，但C和A关系不好。这是不平衡状态，会产生认知冲突。';
                    break;
                case 8:
                    title = '第八种情况：全坏关系';
                    content = 'ABC三个关系都不好。这是不平衡状态，因为所有关系都是消极的，没有积极连接。';
                    break;
            }
    
            desc.innerHTML = `
                <h4>${title}</h4>
                <p>${content}</p>
                <p><a href="https://www.bilibili.com/video/BV12t4y187do/" target="_blank" style="color: #4682b4; text-decoration: underline;">理论视频点击这里</a></p>
            `;
        }

// ==================== MBTI 研究数据系统 ====================
const mbtiRawData = `Warbeb,?,ISTP
waganetsu,?,ISTP
amezy,女,ISTP
yuluo14,?,ISTP
lala,男,ISTJ
a my aRchived,?,ISTJ
JingHu15,男,ISTJ
车轮checo,男,ISTJ
Ninkaze,男,ISTJ
汉堡猫BT,男,ISTJ
番茄青菜蛋饭,男,ISFP
寂舞缥缈,男,ISFP
夏尽,男,ISFP
蜗牛炒蛋,男,ISFP
Mike,?,ISFP
大饼君?H君?,ISFP
Hiroshi,?,ISFP
哔W1e,?,ISFP
汤姆酱焖鸡,?,ISFP
TastyCrab,女,ISFP
[KAZUKI],?,ISFP
果然--,?,ISFP
stand by myside,?,ISFP
Mr.BoBo,?,ISFP
snowflake-11,?,ISFP
yoi,男,ISFP
ANONY,男,ISFP
星沫沐,男,ISFP
BeMikUta,男,ISFP
小初比 Xiao Qiubi,?,ISFP
一只小轮椅,男,ISFP
海星QAQ,?,ISFJ
小稳流星,男,ISFJ
Fok my life,?,ISFJ
千早爱音Anon,?,ISFJ
Siel,?,ISFJ
Naka说到了点该打豆豆了,男,ISFJ
偢倱偆,女,ISFJ
ChrisLeiMeng,男,ISFJ
Izumi,男,ISFJ
ColaYong,?,ISFJ
Yoishi,女,ISFJ
千早爱音Anon,?,ISFJ
white39,男,INTP
TTE9--Koharu,女,INTP
GANLERRR,女,INTP
Sarah-M,女,INTP
灰猫Yoruneko,女,INTP
老咖contrail,男,INTP
Rain Blaze,男,INTP
Yuzumi,男,INTP
KanoDoes Music,男,INTP
Y5C4L3,男,INTP
OJG-KATSU,男,INTP
MungbeanOuO,男,INTP
?(银子好友),?,INTP
Synderelly,女,INTP
·小猪·,?,INTP
venti 4b9,男,INTP
筷子猫official,?,INTP
鲨鱼zz,?,INTP
Sherly パメ,男,INTP
Moko Bread,?,INTP
otter-TATA,?,INTP
PhaPocry,?,INTP
Zed,男,INTJ
夜梦Hana,?,INTJ
CapricPAL,男,INTJ
Nicolas Wangis,男,INTJ
zhx1337,男,INTJ
la.arce,女,INTJ
OVE1,?,INTJ
小早川知世?,INTJ
CapricPAL,?,INTJ
珑珊OwO,女,INFP
Akino,女,INFP
伊凡,女,INFP
furami123,男,INFP
Blue-lanser,男,INFP
浮岛宁宁,男,INFP
shy-boy-檬,男,INFP
沐凉,男,INFP
午休心慌小狗,男,INFP
慵懒na树懒,男,INFP
白浣熊,男,INFP
wumingshin021,男,INFP
Fish鱼鱼,?,INFP
Fanyac,?,INFP
睡着时不困?,INFP
L姗姗子ya,?,INFP
Ebiteneten,?,INFP
sngsng2156,?,INFP
R1n-noname-k0,?,INFP
Fanya-C,?,INFP
风间kazemaaki,?,INFP
RaidonScara,?,INFP
KonoYuuki,?,INFP
hoshino-xy,?,INFP
答案是希臘奶,?,INFP
蓝鸟不怕冷,?,INFP
神乐灰猫,女,INFP
Liangpi,?,INFP
海王星（Neptune）?,INFP
玉米Yumi,?,INFP
涮先森vO,?,INFP
西瓜--,女,INFP
苦菜蔬菜菜,男,INFP
F-ML,女,INFP
LiangTao,?,INFP
18FJ,男,INFP
Reka 一程程程,?,INFP
上榆绘森,男,INFP
夏天躺着唇,女,INFP
须弥小草神纳西妲,男,INFP
野生紫菜汤,男,INFP
poi,?,INFP
Friend1y,?,INFP
残阳之君,男,INFP
Limerence,?,INFP
ShanMo,?,INFP
白日梦呓,男,INFP
Rice fan,女,INFP
我是力量的花?,INFP
柔软不想睡觉,?,INFP
LiangTao,?,INFP
T-Tenma,?,INFP
伊安玲MingEann,女,INFP
秋枫-J16N5,?,INFP
Tina-0815,?,INFP
mikuban'',女,INFJ
伏特加like白兰地,男,INFJ
终实的白开水,男,INFJ
NemiimioO,男,INFJ
螃蟹都有脸,男,INFJ
Aomei,男,INFJ
星瞳老叶,男,INFJ
Amano Yukiteru,男,INFJ
Ash-788,?,INFJ
EE82EE,?,INFJ
Poisons檬?,INFJ
【PK】,男,INFJ
KK蛋糕,?,INFJ
nagano bear,?,INFJ
rain leaf,男,INFJ
Jet Black 03f2,男,INFJ
萱花菂?,INFJ
YoshiKi,?,INFJ
Rin.氵氵,男,INFJ
冷漠是少年,男,INFJ
yoshi,男,ESTP
填页老师,?,ESTP
yu-s,?,ESTP
大聪明是,男,ESTJ
Ferryy,男,ESTJ
POKANET,?,ESTJ
空音,男,ESFP
Wangring,?,ESFP
古龙猫?,ESFP
J1awen,?,ESFP
skeleton,?,ESFP
Vickyki-Momoko,女,ESFP
Asa57,男,ESFP
堇也·U·,男,ESFP
唱歌aniki,女,ESFJ
2892835486,男,ESFJ
药物,女,ESFJ
江苏风景画,男,ESFJ
砂糖Sto,女,ESFJ
奇迹舰船环游世界,女,ENTP
Ferryy,男,ENTP
Alice,男,ENTP
厨子o点 520a,?,ENTP
白帆HQ,男,ENTP
Azusa,男,ENTP
DD代号,男,ENTP
别别动我的枪,男,ENTJ
RAI-Thomas,?,ENTJ
祝亜倱,男,ENTJ
HeshuI喝水,?,ENTJ
SARAHINA,?,ENTJ
灰色旋律,女,ENFP
Rose-宇宙,女,ENFP
白发,男,ENFP
水果披萨,男,ENFP
Cierra,?,ENFP
九龙tv,?,ENFP
阴郁不是柔软,女,ENFP
（HOKO）。（ ﾟΔ ﾟ ）。,女,ENFP
瑶德233,?,ENFP
高级会员制造办公室服务员,男,ENFP
123456 e9cb,男,ENFP
Abel 723a,?,ENFP
ZimoRicardo,?,ENFP
猫与树屋,?,ENFP
firework 133,?,ENFP
是你的步距离,男,ENFP
mirsan,男,ENFP
MG,男,ENFJ
三文鱼,男,ENFJ
sakuyai,男,ENFJ
B站里飘?,ENFJ
?,?,ENFJ
Beas-T,女,ENFJ
Monster20kg,男,ENFJ
月初的雪,男,ENFJ
跨越太猛一,男,ENFJ
睿哲试卷,?,ENFJ
Jak曛醉,男,ENFJ
超级可爱大药罐,男,ESTP
XingYanXY,?,ISFP
子豹98,男,INTJ
薄荷牛奶ouo,男,ISFJ
illusoryXD,男,ISFP
西瓜gurua,男,ISFJ
次元Ciyuan,男,INFP
Orgg,男,ESTJ
Pujateri,男,INTJ
Gabent,男,ESFP
Candy糖果,男,ESTJ
姚名 0f8e,女,INFP
老六Oldsix,男,INTP
serola,女,ENFP
Alan_J,?,ISTJ
BONE_FISH0,?,ISTP
Eines_パメ?,INTJ
sodayoねこ?,INTP
无敌羊仔,?,ENTP
GreatStupid,?,ENTP
江苏（su su）?,INTP
idkmyname,女,INTP
克劳恩皮特,男,INTP
satono-Diamond,男,INFJ
sillykitten,男,ISFP
回鹘kinoko,?,INFP
Guonicky,男,INFP
hypecat93,男,ENFP
—白桦—?,INFP
Butterfly,男,ISFP
姚豹leopard,女,ISTP
Mochikw1,女,ESFP
别吃爆米花?,INFP
FireELF,男,INFP
Carina-aniraC,女,ENFP
魂游于星,女,ESTP
团子每天都好团,女,ENFP
SPIDER,女,ISFP
lady hana,女,ESFP
RaidonScara,?,INFP
Hikaru,?,ESTJ
Vegetablebird,?,INFJ
Lin澪云w,?,INTJ
饼干_Quinn,女,INTP
Bilibili-VK,男,ENFJ
五更琉璃,女,INFJ
黑星海池,男,ISFJ
3倍冰之外檬?,ENFP
LvyLoi_0515,?,INFJ
浅no半是花,女,ISTJ
froned lieyk,女,INTP
天真的柠乐,女,ENFP
min鈥?,INFJ
暗uO,?,INFP
Visionmagic,男,ISTP
夜阑卜吉卜,男,ENFJ
燃烬至孟德?,ENTJ
小东西DX,?,ISFJ
Liz Aoki,?,INTP
小狼XL,?,ENFJ
砂糖Sato,女,ESFJ
Lywra,?,ESFP
WEI儺WEI,?,INFJ
PaperSakura,?,ESTP
Somnus,男,INTP
到处摆烂,?,INFP
yuumi,?,INFP
Lilicotta,?,ISFJ
401shio1,?,INFP
Latteddisoia,女,ENFP
soysauce,?,ENTP
橘猫的puppy,男,ISFP
姗姗子Agoni,男,INFP
yaoyaoyaoO3O,男,INFP
Friedshrimp0v0,男,ISTP
xxchoco,男,ISFP
碎碎念镜花水月cki,男,INFP
慵懒のる,男,ISFP
mineAurora,?,ISFJ
Nyagin,男,INFP
北权 0,?,ISFP
睿柠,?,ISFP
yubinOVO,?,ENFP
kana小饭,女,ENFP
zheermon,?,ISTP
Bocchi777,?,INFP
千里 ddb6,?,INFJ
MY-mio,?,ISTP
傈傈 mikan-,?,ISFP
鸥鹭Kcytip,?,ISFJ
湛蓝湛蓝,女,INFP
水无tsuki 长,男,INTP
Banana cat,男,INTP
Lutoki,女,INFJ
盘盘-panpan,女,ISFP
Big Vy,男,INTJ
Hana,?,ENTP
Ranaaaa,女,ENFP
红推redddd,男,ISFP
Xinhui_813QAQ,男,INTJ
HltoMo,男,INTJ
哇啦_sakuH0,男,ISTJ
Epiphany,男,ENTJ
zwn007,男,INFP
Azelia_YZX,男,ISTP
Mirai♪,男,INFJ
养一只猫星人,男,ISFP
zRepiEx,男,ESTJ
sofe苏菲,男,ESTJ
·Echo·,男,ENTP
天才美少女小张,女,INTP
TinTin,男,INTP
Sky of Starts,男,INFJ
卡密QwQ,?,INFP
路人A,男,INTP
古式琴喵,男,ISFJ
全麦面包,男,INFJ`;

// 荣格8维映射表
const jungianFunctions = {
    'ISTJ': { conscious: 'Si-Te-Fi-Ne', unconscious: 'Se-Ti-Fe-Ni' },
    'ISFJ': { conscious: 'Si-Fe-Ti-Ne', unconscious: 'Se-Fi-Te-Ni' },
    'INFJ': { conscious: 'Ni-Fe-Ti-Se', unconscious: 'Ne-Fi-Te-Si' },
    'INTJ': { conscious: 'Ni-Te-Fi-Se', unconscious: 'Ne-Ti-Fe-Si' },
    'ISTP': { conscious: 'Ti-Se-Ni-Fe', unconscious: 'Te-Si-Ne-Fi' },
    'ISFP': { conscious: 'Fi-Se-Ni-Te', unconscious: 'Fe-Si-Ne-Ti' },
    'INFP': { conscious: 'Fi-Ne-Si-Te', unconscious: 'Fe-Ni-Se-Ti' },
    'INTP': { conscious: 'Ti-Ne-Si-Fe', unconscious: 'Te-Ni-Se-Fi' },
    'ESTP': { conscious: 'Se-Ti-Fe-Ni', unconscious: 'Si-Te-Fi-Ne' },
    'ESFP': { conscious: 'Se-Fi-Te-Ni', unconscious: 'Si-Fe-Ti-Ne' },
    'ENFP': { conscious: 'Ne-Fi-Te-Si', unconscious: 'Ni-Fe-Ti-Se' },
    'ENTP': { conscious: 'Ne-Ti-Fe-Si', unconscious: 'Ni-Te-Fi-Se' },
    'ESTJ': { conscious: 'Te-Si-Ne-Fi', unconscious: 'Ti-Se-Ni-Fe' },
    'ESFJ': { conscious: 'Fe-Si-Ne-Ti', unconscious: 'Fi-Se-Ni-Te' },
    'ENFJ': { conscious: 'Fe-Ni-Se-Ti', unconscious: 'Fi-Ne-Si-Te' },
    'ENTJ': { conscious: 'Te-Ni-Se-Fi', unconscious: 'Ti-Ne-Si-Fe' }
};

// 中国现实MBTI人格类型占比（百分比）
const chinaRealityPercentage = {
    'INFP': 10.62,
    'INTP': 5.71,
    'ISFP': 8.41,
    'INFJ': 5.60,
    'ENFP': 9.43,
    'ISFJ': 9.52,
    'INTJ': 3.74,
    'ENFJ': 5.69,
    'ENTP': 4.35,
    'ESFP': 6.81,
    'ISTP': 3.59,
    'ISTJ': 4.74,
    'ESTJ': 5.41,
    'ENTJ': 3.03,
    'ESFJ': 10.15,
    'ESTP': 3.20
};

// 解析数据
function parseMBTIData() {
    const lines = mbtiRawData.trim().split('\n');
    return lines.map(line => {
        const [id, gender, mbti] = line.split(',');
        return { id, gender, mbti };
    }).filter(item => item.mbti && item.mbti.length === 4);
}

// Keirsey气质分类映射
const keirseyTemperaments = {
    'SJ': { name: '守护者(SJ)', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
    'SP': { name: '技艺者(SP)', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] },
    'NF': { name: '理想主义者(NF)', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
    'NT': { name: '理性者(NT)', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] }
};

// 认知功能映射（主导功能）
const cognitiveFunctionMap = {
    'Se': ['ESTP', 'ESFP'],
    'Si': ['ISTJ', 'ISFJ'],
    'Ne': ['ENTP', 'ENFP'],
    'Ni': ['INTJ', 'INFJ'],
    'Te': ['ESTJ', 'ENTJ'],
    'Ti': ['ISTP', 'INTP'],
    'Fe': ['ESFJ', 'ENFJ'],
    'Fi': ['ISFP', 'INFP']
};

// OPS理论映射（主导功能分类）
// Di = Ti 或 Fi (内倾判断)
// De = Te 或 Fe (外倾判断)
// Oi = Ni 或 Si (内倾观察)
// Oe = Ne 或 Se (外倾观察)
const opsMap = {
    'Di': ['ISTP', 'INTP', 'ISFP', 'INFP'],  // Ti或Fi主导
    'De': ['ESTJ', 'ENTJ', 'ESFJ', 'ENFJ'],  // Te或Fe主导
    'Oi': ['ISTJ', 'ISFJ', 'INTJ', 'INFJ'],  // Si或Ni主导
    'Oe': ['ESTP', 'ESFP', 'ENTP', 'ENFP']   // Se或Ne主导
};

// OPS现实数据占比（根据ChinaRealityPercentage计算）
// Di: ISTP(3.59) + INTP(5.71) + ISFP(8.41) + INFP(10.62) = 28.33%
// De: ESTJ(5.41) + ENTJ(3.03) + ESFJ(10.15) + ENFJ(5.69) = 24.28%
// Oi: ISTJ(4.74) + ISFJ(9.52) + INTJ(3.74) + INFJ(5.60) = 23.60%
// Oe: ESTP(3.20) + ESFP(6.81) + ENTP(4.35) + ENFP(9.43) = 23.79%
const opsRealityPercentage = {
    'Di': 28.33,
    'De': 24.28,
    'Oi': 23.60,
    'Oe': 23.79
};

// 存储图表实例
let mbtiChartInstances = {};
// 当前激活的标签页
let currentMBTITab = 'reality';
// 性别图表是否已渲染
let genderChartsRendered = false;
// 缓存解析后的数据
let cachedMBTIData = null;

// 打开MBTI研究模态框
function openMBTIResearch() {
    const modal = document.getElementById('mbtiModal');
    modal.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    
    // 增加延迟确保 modal 完全显示后再渲染图表
    setTimeout(() => {
        initializeMBTIResearch();
        // 强制所有图表重新计算尺寸
        setTimeout(() => {
            Object.values(mbtiChartInstances).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        }, 100);
    }, 200);
}

// 关闭MBTI研究模态框
function closeMBTIResearch() {
    const modal = document.getElementById('mbtiModal');
    modal.style.display = 'none';
    document.documentElement.style.overflow = '';
}

// 初始化MBTI研究
function initializeMBTIResearch() {
    // 销毁所有已存在的图表实例
    Object.values(mbtiChartInstances).forEach(chart => {
        if (chart) chart.destroy();
    });
    mbtiChartInstances = {};
    
    // 重置标签页状态
    currentMBTITab = 'reality';
    genderChartsRendered = false;
    document.querySelectorAll('.mbti-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === 'reality');
    });
    document.getElementById('mbtiChartsReality').classList.add('active');
    document.getElementById('mbtiChartsGender').classList.remove('active');
    
    const data = parseMBTIData();
    cachedMBTIData = data; // 缓存数据供性别图表使用
    updateMBTIStats(data);
    renderMBTITable(data);
    renderAllMBTICharts(data);
}

// 更新统计数据
function updateMBTIStats(data) {
    const total = data.length;
    const male = data.filter(d => d.gender === '男').length;
    const female = data.filter(d => d.gender === '女').length;
    const unknown = data.filter(d => d.gender === '?').length;
    
    document.getElementById('mbtiTotalCount').textContent = total;
    document.getElementById('mbtiMaleCount').textContent = male;
    document.getElementById('mbtiFemaleCount').textContent = female;
    document.getElementById('mbtiUnknownCount').textContent = unknown;
}

// 渲染数据表格
function renderMBTITable(data) {
    const tbody = document.getElementById('mbtiTableBody');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const functions = jungianFunctions[item.mbti] || { conscious: '-', unconscious: '-' };
        const row = document.createElement('tr');
        row.dataset.id = item.id;
        row.dataset.gender = item.gender;
        row.dataset.mbti = item.mbti;
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.gender}</td>
            <td class="jung-function conscious">${functions.conscious}</td>
            <td class="jung-function unconscious">${functions.unconscious}</td>
            <td><span class="mbti-badge">${item.mbti}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// 搜索过滤功能
function filterMBTITable() {
    const searchId = document.getElementById('mbtiSearchId').value.toLowerCase().trim();
    const searchGender = document.getElementById('mbtiSearchGender').value;
    const searchType = document.getElementById('mbtiSearchType').value;
    
    const tbody = document.getElementById('mbtiTableBody');
    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const id = row.dataset.id.toLowerCase();
        const gender = row.dataset.gender;
        const mbti = row.dataset.mbti;
        
        // 性别映射：将 "?" 映射为"未知"
        const genderMatch = !searchGender || 
            (searchGender === '未知' && gender === '?') || 
            gender === searchGender;
        
        const idMatch = !searchId || id.includes(searchId);
        const typeMatch = !searchType || mbti === searchType;
        
        if (idMatch && genderMatch && typeMatch) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // 更新筛选结果计数
    const countEl = document.getElementById('mbtiFilterCount');
    if (searchId || searchGender || searchType) {
        countEl.textContent = `显示 ${visibleCount} / ${rows.length} 条`;
    } else {
        countEl.textContent = '';
    }
}

// 重置搜索过滤
function resetMBTIFilter() {
    document.getElementById('mbtiSearchId').value = '';
    document.getElementById('mbtiSearchGender').value = '';
    document.getElementById('mbtiSearchType').value = '';
    filterMBTITable();
}

// 渲染所有10个图表
function renderAllMBTICharts(data) {
    const totalCount = data.length;
    
    // 统计MBTI类型分布
    const mbtiCount = {};
    data.forEach(item => {
        mbtiCount[item.mbti] = (mbtiCount[item.mbti] || 0) + 1;
    });
    
    // 按数量排序
    const sortedMBTI = Object.entries(mbtiCount).sort((a, b) => b[1] - a[1]);
    
    // 统计四个维度
    const dimensions = {
        'E': 0, 'I': 0,
        'S': 0, 'N': 0,
        'T': 0, 'F': 0,
        'J': 0, 'P': 0
    };
    
    data.forEach(item => {
        const mbti = item.mbti;
        if (mbti && mbti.length === 4) {
            dimensions[mbti[0]]++;
            dimensions[mbti[1]]++;
            dimensions[mbti[2]]++;
            dimensions[mbti[3]]++;
        }
    });
    
    // 渲染10个图表（顺序与HTML中的canvas元素顺序一致）
    renderCognitiveFuncChart(mbtiCount, totalCount);
    renderCognitiveFuncDiffChart(mbtiCount, totalCount);
    renderTypeChart(sortedMBTI, totalCount, mbtiCount);
    renderTypeDiffChart(mbtiCount, totalCount);
    renderKeirseyChart(mbtiCount, totalCount);
    renderKeirseyDiffChart(mbtiCount, totalCount);
    renderDimensionChart(dimensions, totalCount);
    renderDimensionDiffChart(dimensions, totalCount);
    renderOPSChart(mbtiCount, totalCount);
    renderOPSDiffChart(mbtiCount, totalCount);
}

// 获取通用图表配置
function getMBTIChartOptions(yLabel, xLabel) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: { family: "'华文楷体', cursive", size: 11 },
                    color: '#4682b4',
                    padding: 10,
                    boxWidth: 15
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yLabel,
                    font: { family: "'华文楷体', cursive", size: 12 },
                    color: '#4682b4'
                }
            },
            x: {
                title: {
                    display: true,
                    text: xLabel,
                    font: { family: "'华文楷体', cursive", size: 12 },
                    color: '#4682b4'
                }
            }
        }
    };
}

// 计算中国现实维度分布
function calculateChinaDimensions(totalCount) {
    const chinaRealityDimensions = {
        'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0
    };
    Object.keys(chinaRealityPercentage).forEach(mbti => {
        const percentage = chinaRealityPercentage[mbti];
        const count = (percentage * totalCount / 100);
        chinaRealityDimensions[mbti[0]] += count;
        chinaRealityDimensions[mbti[1]] += count;
        chinaRealityDimensions[mbti[2]] += count;
        chinaRealityDimensions[mbti[3]] += count;
    });
    return chinaRealityDimensions;
}

// 图表1: MBTI类型分布与排序 与现实的对比
function renderTypeChart(sortedMBTI, totalCount, mbtiCount) {
    const canvas = document.getElementById('mbtiTypeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const allTypes = ['INFP', 'INTP', 'ISFP', 'INFJ', 'ENFP', 'ISFJ', 'INTJ', 'ENFJ', 
                      'ENTP', 'ESFP', 'ISTP', 'ISTJ', 'ESTJ', 'ENTJ', 'ESFJ', 'ESTP'];
    
    // 计算VRChat各类型占比（百分比）
    const vrchatPercentages = allTypes.map(type => {
        return ((mbtiCount[type] || 0) / totalCount * 100).toFixed(2);
    });
    
    // 现实各类型占比（百分比）
    const chinaRealityPcts = allTypes.map(type => chinaRealityPercentage[type] || 0);
    
    mbtiChartInstances['typeChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allTypes,
            datasets: [{
                label: 'VRChat 占比 (%)',
                data: vrchatPercentages,
                backgroundColor: 'rgba(135, 206, 235, 0.7)',
                borderColor: 'rgba(95, 158, 160, 1)',
                borderWidth: 2
            }, {
                label: '中国现实占比 (%)',
                data: chinaRealityPcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', 'MBTI 类型')
    });
}

// 图表2: MBTI类型分布 与现实的差异排序
function renderTypeDiffChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiTypeDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const allTypes = Object.keys(chinaRealityPercentage);
    const diffs = allTypes.map(type => {
        const vrchatPct = ((mbtiCount[type] || 0) / totalCount) * 100;
        const chinaPct = chinaRealityPercentage[type];
        return { type, diff: vrchatPct - chinaPct };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['typeDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.type),
            datasets: [{
                label: '差异值（VRChat - 现实）',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(135, 206, 235, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(95, 158, 160, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', 'MBTI 类型（按差异排序）')
    });
}

// 图表3: Keirsey气质分类 与现实的对比
function renderKeirseyChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiKeirseyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const temperamentLabels = ['守护者(SJ)', '技艺者(SP)', '理想主义者(NF)', '理性者(NT)'];
    const temperamentKeys = ['SJ', 'SP', 'NF', 'NT'];
    
    // 计算VRChat各气质占比（百分比）
    const vrchatPcts = temperamentKeys.map(key => {
        const count = keirseyTemperaments[key].types.reduce((sum, type) => sum + (mbtiCount[type] || 0), 0);
        return (count / totalCount * 100).toFixed(2);
    });
    
    // 现实各气质占比（百分比）
    const chinaPcts = temperamentKeys.map(key => {
        return keirseyTemperaments[key].types.reduce((sum, type) => sum + chinaRealityPercentage[type], 0).toFixed(2);
    });
    
    mbtiChartInstances['keirseyChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: temperamentLabels,
            datasets: [{
                label: 'VRChat 占比 (%)',
                data: vrchatPcts,
                backgroundColor: 'rgba(135, 206, 235, 0.7)',
                borderColor: 'rgba(95, 158, 160, 1)',
                borderWidth: 2
            }, {
                label: '中国现实占比 (%)',
                data: chinaPcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', 'Keirsey 气质类型')
    });
}

// 图表4: Keirsey气质分类 与现实的差异排序
function renderKeirseyDiffChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiKeirseyDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const temperamentKeys = ['SJ', 'SP', 'NF', 'NT'];
    const diffs = temperamentKeys.map(key => {
        const vrchatCount = keirseyTemperaments[key].types.reduce((sum, type) => sum + (mbtiCount[type] || 0), 0);
        const vrchatPct = (vrchatCount / totalCount) * 100;
        const chinaPct = keirseyTemperaments[key].types.reduce((sum, type) => sum + chinaRealityPercentage[type], 0);
        return { name: keirseyTemperaments[key].name, diff: vrchatPct - chinaPct };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['keirseyDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.name),
            datasets: [{
                label: '差异值（VRChat - 现实）',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(135, 206, 235, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(95, 158, 160, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', 'Keirsey 气质类型（按差异排序）')
    });
}

// 图表5: MBTI四个维度 与现实的对比
function renderDimensionChart(dimensions, totalCount) {
    const canvas = document.getElementById('mbtiDimensionChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const chinaRealityDimensions = calculateChinaDimensions(totalCount);
    
    // 同类型维度相邻排列：I/E, N/S, T/F, J/P
    const sortedLabels = ['I', 'E', 'N', 'S', 'T', 'F', 'J', 'P'];
    
    // 计算VRChat各维度占比（百分比）
    const vrchatPcts = sortedLabels.map(d => (dimensions[d] / totalCount * 100).toFixed(2));
    
    // 计算现实各维度占比（百分比）
    const chinaPcts = sortedLabels.map(d => (chinaRealityDimensions[d] / totalCount * 100).toFixed(2));
    
    mbtiChartInstances['dimensionChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                label: 'VRChat 占比 (%)',
                data: vrchatPcts,
                backgroundColor: 'rgba(135, 206, 235, 0.7)',
                borderColor: 'rgba(95, 158, 160, 1)',
                borderWidth: 2
            }, {
                label: '中国现实占比 (%)',
                data: chinaPcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', '维度')
    });
}

// 图表6: MBTI四个维度 与现实的差异排序
function renderDimensionDiffChart(dimensions, totalCount) {
    const canvas = document.getElementById('mbtiDimensionDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const chinaRealityDimensions = calculateChinaDimensions(totalCount);
    const dimLabels = ['I', 'E', 'N', 'S', 'T', 'F', 'J', 'P'];
    
    // 按差异值从大到小排序
    const diffs = dimLabels.map(d => ({
        label: d,
        diff: ((dimensions[d] / totalCount) - (chinaRealityDimensions[d] / totalCount)) * 100
    })).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['dimensionDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.label),
            datasets: [{
                label: '差异值（VRChat - 现实）',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(135, 206, 235, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(95, 158, 160, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', '维度（按差异排序）')
    });
}

// 图表7: 认知功能 与现实的对比
function renderCognitiveFuncChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiCognitiveFuncChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const funcLabels = ['Se', 'Si', 'Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'];
    
    // 计算VRChat各认知功能占比（百分比）
    const vrchatPcts = funcLabels.map(func => {
        const count = cognitiveFunctionMap[func].reduce((sum, type) => sum + (mbtiCount[type] || 0), 0);
        return (count / totalCount * 100).toFixed(2);
    });
    
    // 现实各认知功能占比（百分比）
    const chinaPcts = funcLabels.map(func => {
        return cognitiveFunctionMap[func].reduce((sum, type) => sum + chinaRealityPercentage[type], 0).toFixed(2);
    });
    
    mbtiChartInstances['cognitiveFuncChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: funcLabels,
            datasets: [{
                label: 'VRChat 占比 (%)',
                data: vrchatPcts,
                backgroundColor: 'rgba(135, 206, 235, 0.7)',
                borderColor: 'rgba(95, 158, 160, 1)',
                borderWidth: 2
            }, {
                label: '中国现实占比 (%)',
                data: chinaPcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', '认知功能（主导功能）')
    });
}

// 图表8: 认知功能 与现实的差异排序
function renderCognitiveFuncDiffChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiCognitiveFuncDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const funcLabels = ['Se', 'Si', 'Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'];
    
    const diffs = funcLabels.map(func => {
        const vrchatCount = cognitiveFunctionMap[func].reduce((sum, type) => sum + (mbtiCount[type] || 0), 0);
        const vrchatPct = (vrchatCount / totalCount) * 100;
        const chinaPct = cognitiveFunctionMap[func].reduce((sum, type) => sum + chinaRealityPercentage[type], 0);
        return { func, diff: vrchatPct - chinaPct };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['cognitiveFuncDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.func),
            datasets: [{
                label: '差异值（VRChat - 现实）',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(135, 206, 235, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(95, 158, 160, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', '认知功能（按差异排序）')
    });
}

// 图表9: OPS理论 与现实的对比
function renderOPSChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiOPSChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const opsLabels = ['Di', 'De', 'Oi', 'Oe'];
    const opsNames = ['Di (Ti/Fi)', 'De (Te/Fe)', 'Oi (Si/Ni)', 'Oe (Ne/Se)'];
    
    // 计算VRChat各OPS分类占比（百分比）
    const vrchatPcts = opsLabels.map(ops => {
        const count = opsMap[ops].reduce((sum, type) => sum + (mbtiCount[type] || 0), 0);
        return (count / totalCount * 100).toFixed(2);
    });
    
    // 现实各OPS分类占比（百分比）
    const chinaPcts = opsLabels.map(ops => opsRealityPercentage[ops].toFixed(2));
    
    mbtiChartInstances['opsChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: opsNames,
            datasets: [{
                label: 'VRChat 占比 (%)',
                data: vrchatPcts,
                backgroundColor: 'rgba(135, 206, 235, 0.7)',
                borderColor: 'rgba(95, 158, 160, 1)',
                borderWidth: 2
            }, {
                label: '中国现实占比 (%)',
                data: chinaPcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', 'OPS 功能分类')
    });
}

// 图表10: OPS理论 与现实的差异排序
function renderOPSDiffChart(mbtiCount, totalCount) {
    const canvas = document.getElementById('mbtiOPSDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const opsLabels = ['Di', 'De', 'Oi', 'Oe'];
    const opsNames = { 'Di': 'Di (Ti/Fi)', 'De': 'De (Te/Fe)', 'Oi': 'Oi (Si/Ni)', 'Oe': 'Oe (Ne/Se)' };
    
    const diffs = opsLabels.map(ops => {
        const vrchatCount = opsMap[ops].reduce((sum, type) => sum + (mbtiCount[type] || 0), 0);
        const vrchatPct = (vrchatCount / totalCount) * 100;
        const chinaPct = opsRealityPercentage[ops];
        return { ops, name: opsNames[ops], diff: vrchatPct - chinaPct };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['opsDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.name),
            datasets: [{
                label: '差异值（VRChat - 现实）',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(135, 206, 235, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(95, 158, 160, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', 'OPS 功能分类（按差异排序）')
    });
}


// ==================== MBTI 标签页切换与性别对比图表 ====================

// 标签页切换函数
function switchMBTITab(tab) {
    if (tab === currentMBTITab) return;
    
    // 更新标签按钮状态
    document.querySelectorAll('.mbti-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // 切换内容显示
    document.getElementById('mbtiChartsReality').classList.toggle('active', tab === 'reality');
    document.getElementById('mbtiChartsGender').classList.toggle('active', tab === 'gender');
    
    currentMBTITab = tab;
    
    // 首次切换到性别标签时渲染图表
    if (tab === 'gender' && !genderChartsRendered) {
        renderAllGenderCharts(cachedMBTIData || parseMBTIData());
        genderChartsRendered = true;
    }
}

// 渲染所有性别对比图表
function renderAllGenderCharts(data) {
    console.log('renderAllGenderCharts called, data length:', data ? data.length : 'null');
    
    // 分离男女数据
    const maleData = data.filter(d => d.gender === '男');
    const femaleData = data.filter(d => d.gender === '女');
    
    const maleCount = maleData.length;
    const femaleCount = femaleData.length;
    
    console.log('Male count:', maleCount, 'Female count:', femaleCount);
    
    // 统计男性MBTI分布
    const maleMBTI = {};
    maleData.forEach(item => {
        maleMBTI[item.mbti] = (maleMBTI[item.mbti] || 0) + 1;
    });
    
    // 统计女性MBTI分布
    const femaleMBTI = {};
    femaleData.forEach(item => {
        femaleMBTI[item.mbti] = (femaleMBTI[item.mbti] || 0) + 1;
    });
    
    // 统计男性维度
    const maleDimensions = { 'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0 };
    maleData.forEach(item => {
        const mbti = item.mbti;
        maleDimensions[mbti[0]]++;
        maleDimensions[mbti[1]]++;
        maleDimensions[mbti[2]]++;
        maleDimensions[mbti[3]]++;
    });
    
    // 统计女性维度
    const femaleDimensions = { 'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0 };
    femaleData.forEach(item => {
        const mbti = item.mbti;
        femaleDimensions[mbti[0]]++;
        femaleDimensions[mbti[1]]++;
        femaleDimensions[mbti[2]]++;
        femaleDimensions[mbti[3]]++;
    });
    
    // 渲染10个性别对比图表
    renderGenderTypeChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderTypeDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderKeirseyChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderKeirseyDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderDimensionChart(maleDimensions, femaleDimensions, maleCount, femaleCount);
    renderGenderDimensionDiffChart(maleDimensions, femaleDimensions, maleCount, femaleCount);
    renderGenderCognitiveFuncChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderCognitiveFuncDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderOPSChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
    renderGenderOPSDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount);
}

// 图表1: MBTI类型 男女对比
function renderGenderTypeChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiTypeGenderChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const allTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    
    // 计算男性各类型占比（百分比）
    const malePcts = allTypes.map(t => ((maleMBTI[t] || 0) / maleCount * 100).toFixed(2));
    
    // 计算女性各类型占比（百分比）
    const femalePcts = allTypes.map(t => ((femaleMBTI[t] || 0) / femaleCount * 100).toFixed(2));
    
    mbtiChartInstances['genderTypeChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allTypes,
            datasets: [{
                label: `男性占比(n=${maleCount}) %`,
                data: malePcts,
                backgroundColor: 'rgba(100, 149, 237, 0.7)',
                borderColor: 'rgba(65, 105, 225, 1)',
                borderWidth: 2
            }, {
                label: `女性占比(n=${femaleCount}) %`,
                data: femalePcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', 'MBTI类型')
    });
}

// 图表2: MBTI类型 男女差异排序
function renderGenderTypeDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiTypeGenderDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const allTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    
    const diffs = allTypes.map(type => ({
        type,
        diff: maleCount > 0 && femaleCount > 0 
            ? ((maleMBTI[type] || 0) / maleCount - (femaleMBTI[type] || 0) / femaleCount) * 100 
            : 0
    })).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['genderTypeDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.type),
            datasets: [{
                label: '差异值（男性 - 女性）%',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(100, 149, 237, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(65, 105, 225, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', 'MBTI类型（按差异排序）')
    });
}

// 图表3: Keirsey气质 男女对比
function renderGenderKeirseyChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiKeirseyGenderChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const tempLabels = Object.keys(keirseyTemperaments);
    const tempNames = tempLabels.map(k => keirseyTemperaments[k].name);
    
    // 计算男性各气质占比（百分比）
    const malePcts = tempLabels.map(temp => {
        const count = keirseyTemperaments[temp].types.reduce((sum, type) => sum + (maleMBTI[type] || 0), 0);
        return (count / maleCount * 100).toFixed(2);
    });
    
    // 计算女性各气质占比（百分比）
    const femalePcts = tempLabels.map(temp => {
        const count = keirseyTemperaments[temp].types.reduce((sum, type) => sum + (femaleMBTI[type] || 0), 0);
        return (count / femaleCount * 100).toFixed(2);
    });
    
    mbtiChartInstances['genderKeirseyChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tempNames,
            datasets: [{
                label: `男性占比(n=${maleCount}) %`,
                data: malePcts,
                backgroundColor: 'rgba(100, 149, 237, 0.7)',
                borderColor: 'rgba(65, 105, 225, 1)',
                borderWidth: 2
            }, {
                label: `女性占比(n=${femaleCount}) %`,
                data: femalePcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', 'Keirsey气质类型')
    });
}

// 图表4: Keirsey气质 男女差异排序
function renderGenderKeirseyDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiKeirseyGenderDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const tempLabels = Object.keys(keirseyTemperaments);
    
    const diffs = tempLabels.map(temp => {
        const maleVal = keirseyTemperaments[temp].types.reduce((sum, type) => sum + (maleMBTI[type] || 0), 0);
        const femaleVal = keirseyTemperaments[temp].types.reduce((sum, type) => sum + (femaleMBTI[type] || 0), 0);
        return {
            name: keirseyTemperaments[temp].name,
            diff: maleCount > 0 && femaleCount > 0 
                ? (maleVal / maleCount - femaleVal / femaleCount) * 100 
                : 0
        };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['genderKeirseyDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.name),
            datasets: [{
                label: '差异值（男性 - 女性）%',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(100, 149, 237, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(65, 105, 225, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', 'Keirsey气质（按差异排序）')
    });
}

// 图表5: 四个维度 男女对比
function renderGenderDimensionChart(maleDimensions, femaleDimensions, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiDimensionGenderChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // 同类型维度相邻排列：I/E, N/S, T/F, J/P
    const sortedLabels = ['I', 'E', 'N', 'S', 'T', 'F', 'J', 'P'];
    
    // 计算男性各维度占比（百分比）
    const malePcts = sortedLabels.map(d => (maleDimensions[d] / maleCount * 100).toFixed(2));
    
    // 计算女性各维度占比（百分比）
    const femalePcts = sortedLabels.map(d => (femaleDimensions[d] / femaleCount * 100).toFixed(2));
    
    mbtiChartInstances['genderDimensionChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                label: `男性占比(n=${maleCount}) %`,
                data: malePcts,
                backgroundColor: 'rgba(100, 149, 237, 0.7)',
                borderColor: 'rgba(65, 105, 225, 1)',
                borderWidth: 2
            }, {
                label: `女性占比(n=${femaleCount}) %`,
                data: femalePcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', '维度')
    });
}

// 图表6: 四个维度 男女差异排序
function renderGenderDimensionDiffChart(maleDimensions, femaleDimensions, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiDimensionGenderDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // 同类型维度相邻排列：I/E, N/S, T/F, J/P
    const dimLabels = ['I', 'E', 'N', 'S', 'T', 'F', 'J', 'P'];
    
    const diffs = dimLabels.map(d => ({
        label: d,
        diff: maleCount > 0 && femaleCount > 0 
            ? (maleDimensions[d] / maleCount - femaleDimensions[d] / femaleCount) * 100 
            : 0
    })).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['genderDimensionDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.label),
            datasets: [{
                label: '差异值（男性 - 女性）%',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(100, 149, 237, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(65, 105, 225, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', '维度（按差异排序）')
    });
}

// 图表7: 认知功能 男女对比
function renderGenderCognitiveFuncChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiCognitiveFuncGenderChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const funcLabels = ['Se', 'Si', 'Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'];
    
    // 计算男性各认知功能占比（百分比）
    const malePcts = funcLabels.map(func => {
        const count = cognitiveFunctionMap[func].reduce((sum, type) => sum + (maleMBTI[type] || 0), 0);
        return (count / maleCount * 100).toFixed(2);
    });
    
    // 计算女性各认知功能占比（百分比）
    const femalePcts = funcLabels.map(func => {
        const count = cognitiveFunctionMap[func].reduce((sum, type) => sum + (femaleMBTI[type] || 0), 0);
        return (count / femaleCount * 100).toFixed(2);
    });
    
    mbtiChartInstances['genderCognitiveFuncChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: funcLabels,
            datasets: [{
                label: `男性占比(n=${maleCount}) %`,
                data: malePcts,
                backgroundColor: 'rgba(100, 149, 237, 0.7)',
                borderColor: 'rgba(65, 105, 225, 1)',
                borderWidth: 2
            }, {
                label: `女性占比(n=${femaleCount}) %`,
                data: femalePcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', '认知功能')
    });
}

// 图表8: 认知功能 男女差异排序
function renderGenderCognitiveFuncDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiCognitiveFuncGenderDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const funcLabels = ['Se', 'Si', 'Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'];
    
    const diffs = funcLabels.map(func => {
        const maleVal = cognitiveFunctionMap[func].reduce((sum, type) => sum + (maleMBTI[type] || 0), 0);
        const femaleVal = cognitiveFunctionMap[func].reduce((sum, type) => sum + (femaleMBTI[type] || 0), 0);
        return {
            func,
            diff: maleCount > 0 && femaleCount > 0 
                ? (maleVal / maleCount - femaleVal / femaleCount) * 100 
                : 0
        };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['genderCognitiveFuncDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.func),
            datasets: [{
                label: '差异值（男性 - 女性）%',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(100, 149, 237, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(65, 105, 225, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', '认知功能（按差异排序）')
    });
}

// 图表9: OPS理论 男女对比
function renderGenderOPSChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiOPSGenderChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const opsLabels = ['Di', 'De', 'Oi', 'Oe'];
    const opsNames = ['Di (Ti/Fi)', 'De (Te/Fe)', 'Oi (Si/Ni)', 'Oe (Ne/Se)'];
    
    // 计算男性各OPS分类占比（百分比）
    const malePcts = opsLabels.map(ops => {
        const count = opsMap[ops].reduce((sum, type) => sum + (maleMBTI[type] || 0), 0);
        return (count / maleCount * 100).toFixed(2);
    });
    
    // 计算女性各OPS分类占比（百分比）
    const femalePcts = opsLabels.map(ops => {
        const count = opsMap[ops].reduce((sum, type) => sum + (femaleMBTI[type] || 0), 0);
        return (count / femaleCount * 100).toFixed(2);
    });
    
    mbtiChartInstances['genderOPSChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: opsNames,
            datasets: [{
                label: `男性占比(n=${maleCount}) %`,
                data: malePcts,
                backgroundColor: 'rgba(100, 149, 237, 0.7)',
                borderColor: 'rgba(65, 105, 225, 1)',
                borderWidth: 2
            }, {
                label: `女性占比(n=${femaleCount}) %`,
                data: femalePcts,
                backgroundColor: 'rgba(255, 182, 193, 0.7)',
                borderColor: 'rgba(255, 105, 180, 1)',
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('占比 (%)', 'OPS 功能分类')
    });
}

// 图表10: OPS理论 男女差异排序
function renderGenderOPSDiffChart(maleMBTI, femaleMBTI, maleCount, femaleCount) {
    const canvas = document.getElementById('mbtiOPSGenderDiffChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const opsLabels = ['Di', 'De', 'Oi', 'Oe'];
    const opsNames = { 'Di': 'Di (Ti/Fi)', 'De': 'De (Te/Fe)', 'Oi': 'Oi (Si/Ni)', 'Oe': 'Oe (Ne/Se)' };
    
    const diffs = opsLabels.map(ops => {
        const maleVal = opsMap[ops].reduce((sum, type) => sum + (maleMBTI[type] || 0), 0);
        const femaleVal = opsMap[ops].reduce((sum, type) => sum + (femaleMBTI[type] || 0), 0);
        return {
            ops,
            name: opsNames[ops],
            diff: maleCount > 0 && femaleCount > 0 
                ? (maleVal / maleCount - femaleVal / femaleCount) * 100 
                : 0
        };
    }).sort((a, b) => b.diff - a.diff);
    
    mbtiChartInstances['genderOPSDiffChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diffs.map(d => d.name),
            datasets: [{
                label: '差异值（男性 - 女性）%',
                data: diffs.map(d => d.diff.toFixed(2)),
                backgroundColor: diffs.map(d => d.diff >= 0 ? 'rgba(100, 149, 237, 0.7)' : 'rgba(255, 182, 193, 0.7)'),
                borderColor: diffs.map(d => d.diff >= 0 ? 'rgba(65, 105, 225, 1)' : 'rgba(255, 105, 180, 1)'),
                borderWidth: 2
            }]
        },
        options: getMBTIChartOptions('差异百分比(%)', 'OPS 功能分类（按差异排序）')
    });
}