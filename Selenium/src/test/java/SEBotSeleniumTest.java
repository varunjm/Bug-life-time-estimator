import static org.junit.Assert.*;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class SEBotSeleniumTest {

	private static WebDriver driver;
	//"https://github.ncsu.edu/<owner>/<reponame>/issues/new"
	//"https://github.com/<owner>/<reponame>/issues/new"
	private String URL="https://github.com/sebottest/SeleniumTesting/issues/new";
	private String URL2="https://github.com/sebottest/SeleniumTesting/issues/8";
	private String id="sebottest";
	private String pass="SE-Bot9367";
	
	@Before
	public void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}
	
	@After
	public void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	@Test
	public void Case1() throws Exception
	{		
		boolean ncsu=false;
		if(URL.contains("ncsu.edu"))
			ncsu=true;
		
		driver.get(URL);
		
		//WebElement user = driver.findElement(By.id("login_field"));
		//WebElement password = driver.findElement(By.id("password"));
		Thread.sleep(2000);
		WebElement user = driver.findElement(By.xpath("//*[@id=\"login_field\"]"));
		WebElement password = driver.findElement(By.xpath("//*[@id=\"password\"]"));//*[@id="login"]/form/div[5]/input[3]

		//System.out.println(user);
		WebElement signin;
		if(ncsu)
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[5]/input[3]"));
		else
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[4]/input[3]"));
		user.sendKeys(id);
		password.sendKeys(pass);
		signin.click();
		
		WebElement title = driver.findElement(By.id("issue_title"));
		title.sendKeys("Test Sel2");
		WebElement desc = driver.findElement(By.id("issue_body"));
		desc.sendKeys("Priority - P2\nSeverity - critical\nOS - Windows\nBug Dependency List - None");

		WebElement submit = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[1]/div/div/div[3]/button"));
		submit.click();
		Thread.sleep(2000);
		driver.navigate().refresh();
		Thread.sleep(2000);
		
		List<WebElement> comments = driver.findElements(By.xpath("//*[@id=\"discussion_bucket\"]/div[3]/div[1]/div"));
		int comment_count=comments.size();
		//assertNotNull(comment);
		System.out.println(comment_count);
		assertEquals(2, comment_count);
	}
	@Test
	public void Case2() throws Exception
	{
		boolean ncsu=false;
		if(URL2.contains("ncsu.edu"))
			ncsu=true;
		driver.get(URL2);

		Thread.sleep(2000);
		WebElement user = driver.findElement(By.xpath("//*[@id=\"login_field\"]"));
		WebElement password = driver.findElement(By.xpath("//*[@id=\"password\"]"));//*[@id="login"]/form/div[5]/input[3]

		WebElement signin;
		if(ncsu)
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[5]/input[3]"));
		else
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[4]/input[3]"));

		user.sendKeys(id);
		password.sendKeys(pass);
		signin.click();
		
		List<WebElement> comments = driver.findElements(By.xpath("//p[contains(text(),'This bug is expected to take')]"));
		int comment_count=comments.size();
		
		WebElement comment = driver.findElement(By.id("new_comment_field"));
		comment.sendKeys("Testing comment");
		WebElement submit = driver.findElement(By.xpath("//*[@id=\"partial-new-comment-form-actions\"]/button[1]"));
		submit.click();
		Thread.sleep(2000);
		driver.navigate().refresh();
		Thread.sleep(2000);
		List<WebElement> comment2 = driver.findElements(By.xpath("//p[contains(text(),'This bug is expected to take')]"));
		System.out.println(comment_count);
		assertEquals(comment_count, comment2.size());
	}
	@Test
	public void Case3() throws Exception
	{		
		boolean ncsu=false;
		if(URL.contains("ncsu.edu"))
			ncsu=true;
		
		driver.get(URL);
		
		//WebElement user = driver.findElement(By.id("login_field"));
		//WebElement password = driver.findElement(By.id("password"));
		Thread.sleep(2000);
		WebElement user = driver.findElement(By.xpath("//*[@id=\"login_field\"]"));
		WebElement password = driver.findElement(By.xpath("//*[@id=\"password\"]"));//*[@id="login"]/form/div[5]/input[3]

		//System.out.println(user);
		WebElement signin;
		if(ncsu)
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[5]/input[3]"));
		else
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[4]/input[3]"));
		user.sendKeys(id);
		password.sendKeys(pass);
		signin.click();
		
		WebElement title = driver.findElement(By.id("issue_title"));
		title.sendKeys("Test Sel2");
		WebElement desc = driver.findElement(By.id("issue_body"));
		desc.sendKeys("Priority - P2\nSeverity - critical\nOS - Windows\nBug Dependency List - None");
        
		WebElement label = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[2]/div[1]/div/div[1]/button"));
		label.click();
		WebElement bug = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[2]/div[1]/div/div[1]/div/div/div[3]/div[1]/div/div/div/span[2]"));
		bug.click();
		WebElement exitlabel = driver.findElement(By.xpath("//*[@id=\"js-repo-pjax-container\"]/div[2]/div[2]"));
		exitlabel.click();
		WebElement submit = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[1]/div/div/div[3]/button"));
		submit.click();
		Thread.sleep(2000);
		driver.navigate().refresh();
		Thread.sleep(2000);
		
		WebElement comment = driver.findElement(By.xpath("//p[contains(text(),'This bug is expected to take')]"));//div[class=\"comment-body markdown-body markdown-format js-comment-body\"]"));
		
		assertNotNull(comment);
		//System.out.println(comment_parent.size());
		assertEquals(false, comment.getText().contains("(by taking default values for missing data)"));
	}
	@Test
	public void Case4() throws Exception
	{		
		boolean ncsu=false;
		if(URL.contains("ncsu.edu"))
			ncsu=true;
		
		driver.get(URL);
		
		//WebElement user = driver.findElement(By.id("login_field"));
		//WebElement password = driver.findElement(By.id("password"));
		Thread.sleep(2000);
		WebElement user = driver.findElement(By.xpath("//*[@id=\"login_field\"]"));
		WebElement password = driver.findElement(By.xpath("//*[@id=\"password\"]"));//*[@id="login"]/form/div[5]/input[3]

		//System.out.println(user);
		WebElement signin;
		if(ncsu)
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[5]/input[3]"));
		else
			signin= driver.findElement(By.xpath("//*[@id=\"login\"]/form/div[4]/input[3]"));
		user.sendKeys(id);
		password.sendKeys(pass);
		signin.click();
		
		WebElement title = driver.findElement(By.id("issue_title"));
		title.sendKeys("Test Sel2");
		WebElement desc = driver.findElement(By.id("issue_body"));
		desc.sendKeys("Priority - P2\nSeverity - critical\nOS - Windows");
        
		WebElement label = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[2]/div[1]/div/div[1]/button"));
		label.click();
		WebElement bug = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[2]/div[1]/div/div[1]/div/div/div[3]/div[1]/div/div/div/span[2]"));
		bug.click();
		WebElement exitlabel = driver.findElement(By.xpath("//*[@id=\"js-repo-pjax-container\"]/div[2]/div[2]"));
		exitlabel.click();
		WebElement submit = driver.findElement(By.xpath("//*[@id=\"new_issue\"]/div[2]/div[1]/div/div/div[3]/button"));
		submit.click();
		Thread.sleep(2000);
		driver.navigate().refresh();
		Thread.sleep(2000);
		
		WebElement comment = driver.findElement(By.xpath("//p[contains(text(),'This bug is expected to take')]"));//div[class=\"comment-body markdown-body markdown-format js-comment-body\"]"));
		
		assertNotNull(comment);
		//System.out.println(comment_parent.size());
		assertEquals(true, comment.getText().contains("(by taking default values for missing data)"));
	}
}
